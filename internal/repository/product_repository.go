package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"invoice-saas/internal/model"
)

type ProductRepository struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

func (r *ProductRepository) Create(product *model.Product) error {
	query := `
		INSERT INTO products (organization_id, name, description, price, unit)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(query, product.OrganizationID, product.Name, product.Description, product.Price, product.Unit).
		Scan(&product.ID, &product.CreatedAt, &product.UpdatedAt)
}

func (r *ProductRepository) Update(product *model.Product) error {
	query := `
		UPDATE products
		SET name = $1, description = $2, price = $3, unit = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5 AND organization_id = $6
	`
	result, err := r.db.Exec(query, product.Name, product.Description, product.Price, product.Unit, product.ID, product.OrganizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("product not found")
	}
	
	return nil
}

func (r *ProductRepository) Delete(id, organizationID int) error {
	query := `DELETE FROM products WHERE id = $1 AND organization_id = $2`
	result, err := r.db.Exec(query, id, organizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("product not found")
	}
	
	return nil
}

func (r *ProductRepository) FindByID(id, organizationID int) (*model.Product, error) {
	product := &model.Product{}
	query := `
		SELECT id, organization_id, name, description, price, unit, created_at, updated_at
		FROM products
		WHERE id = $1 AND organization_id = $2
	`
	err := r.db.QueryRow(query, id, organizationID).Scan(
		&product.ID, &product.OrganizationID, &product.Name, &product.Description,
		&product.Price, &product.Unit, &product.CreatedAt, &product.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("product not found")
	}
	if err != nil {
		return nil, err
	}
	return product, nil
}

func (r *ProductRepository) List(organizationID int, search string, page, limit int) ([]model.Product, int, error) {
	offset := (page - 1) * limit
	
	whereClause := "WHERE organization_id = $1"
	args := []interface{}{organizationID}
	argCount := 1
	
	if search != "" {
		argCount++
		whereClause += fmt.Sprintf(" AND (name ILIKE $%d OR description ILIKE $%d)", argCount, argCount)
		args = append(args, "%"+strings.ToLower(search)+"%")
	}
	
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM products %s", whereClause)
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}
	
	query := fmt.Sprintf(`
		SELECT id, organization_id, name, description, price, unit, created_at, updated_at
		FROM products
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argCount+1, argCount+2)
	
	args = append(args, limit, offset)
	
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()
	
	products := []model.Product{}
	for rows.Next() {
		var product model.Product
		err := rows.Scan(
			&product.ID, &product.OrganizationID, &product.Name, &product.Description,
			&product.Price, &product.Unit, &product.CreatedAt, &product.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		products = append(products, product)
	}
	
	return products, total, nil
}
