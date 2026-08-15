package repository

import (
	"database/sql"
	"fmt"
	"strings"

	"invoice-saas/internal/model"
)

type CustomerRepository struct {
	db *sql.DB
}

func NewCustomerRepository(db *sql.DB) *CustomerRepository {
	return &CustomerRepository{db: db}
}

func (r *CustomerRepository) Create(customer *model.Customer) error {
	query := `
		INSERT INTO customers (organization_id, name, email, phone, address)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(query, customer.OrganizationID, customer.Name, customer.Email, customer.Phone, customer.Address).
		Scan(&customer.ID, &customer.CreatedAt, &customer.UpdatedAt)
}

func (r *CustomerRepository) Update(customer *model.Customer) error {
	query := `
		UPDATE customers
		SET name = $1, email = $2, phone = $3, address = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5 AND organization_id = $6
	`
	result, err := r.db.Exec(query, customer.Name, customer.Email, customer.Phone, customer.Address, customer.ID, customer.OrganizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("customer not found")
	}
	
	return nil
}

func (r *CustomerRepository) Delete(id, organizationID int) error {
	query := `DELETE FROM customers WHERE id = $1 AND organization_id = $2`
	result, err := r.db.Exec(query, id, organizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("customer not found")
	}
	
	return nil
}

func (r *CustomerRepository) FindByID(id, organizationID int) (*model.Customer, error) {
	customer := &model.Customer{}
	query := `
		SELECT id, organization_id, name, email, phone, address, created_at, updated_at
		FROM customers
		WHERE id = $1 AND organization_id = $2
	`
	err := r.db.QueryRow(query, id, organizationID).Scan(
		&customer.ID, &customer.OrganizationID, &customer.Name, &customer.Email,
		&customer.Phone, &customer.Address, &customer.CreatedAt, &customer.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("customer not found")
	}
	if err != nil {
		return nil, err
	}
	return customer, nil
}

func (r *CustomerRepository) List(organizationID int, search string, page, limit int) ([]model.Customer, int, error) {
	offset := (page - 1) * limit
	
	// Build query with search
	whereClause := "WHERE organization_id = $1"
	args := []interface{}{organizationID}
	argCount := 1
	
	if search != "" {
		argCount++
		whereClause += fmt.Sprintf(" AND (name ILIKE $%d OR email ILIKE $%d)", argCount, argCount)
		args = append(args, "%"+strings.ToLower(search)+"%")
	}
	
	// Get total count
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM customers %s", whereClause)
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}
	
	// Get customers
	query := fmt.Sprintf(`
		SELECT id, organization_id, name, email, phone, address, created_at, updated_at
		FROM customers
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
	
	customers := []model.Customer{}
	for rows.Next() {
		var customer model.Customer
		err := rows.Scan(
			&customer.ID, &customer.OrganizationID, &customer.Name, &customer.Email,
			&customer.Phone, &customer.Address, &customer.CreatedAt, &customer.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		customers = append(customers, customer)
	}
	
	return customers, total, nil
}

func (r *CustomerRepository) Count(organizationID int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM customers WHERE organization_id = $1`
	err := r.db.QueryRow(query, organizationID).Scan(&count)
	return count, err
}
