package repository

import (
	"database/sql"
	"fmt"
	"time"

	"invoice-saas/internal/model"
)

type InvoiceRepository struct {
	db *sql.DB
}

func NewInvoiceRepository(db *sql.DB) *InvoiceRepository {
	return &InvoiceRepository{db: db}
}

func (r *InvoiceRepository) Create(invoice *model.Invoice) error {
	query := `
		INSERT INTO invoices (organization_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax, discount, total, notes)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(
		query,
		invoice.OrganizationID, invoice.CustomerID, invoice.InvoiceNumber, invoice.Status,
		invoice.IssueDate, invoice.DueDate, invoice.Subtotal, invoice.Tax, invoice.Discount,
		invoice.Total, invoice.Notes,
	).Scan(&invoice.ID, &invoice.CreatedAt, &invoice.UpdatedAt)
}

func (r *InvoiceRepository) Update(invoice *model.Invoice) error {
	query := `
		UPDATE invoices
		SET customer_id = $1, issue_date = $2, due_date = $3, subtotal = $4, tax = $5, discount = $6, total = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
		WHERE id = $9 AND organization_id = $10
	`
	result, err := r.db.Exec(
		query,
		invoice.CustomerID, invoice.IssueDate, invoice.DueDate, invoice.Subtotal,
		invoice.Tax, invoice.Discount, invoice.Total, invoice.Notes,
		invoice.ID, invoice.OrganizationID,
	)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("invoice not found")
	}
	
	return nil
}

func (r *InvoiceRepository) UpdateStatus(id, organizationID int, status string) error {
	query := `
		UPDATE invoices
		SET status = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2 AND organization_id = $3
	`
	result, err := r.db.Exec(query, status, id, organizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("invoice not found")
	}
	
	return nil
}

func (r *InvoiceRepository) Delete(id, organizationID int) error {
	query := `DELETE FROM invoices WHERE id = $1 AND organization_id = $2`
	result, err := r.db.Exec(query, id, organizationID)
	if err != nil {
		return err
	}
	
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	
	if rows == 0 {
		return fmt.Errorf("invoice not found")
	}
	
	return nil
}

func (r *InvoiceRepository) FindByID(id, organizationID int) (*model.Invoice, error) {
	invoice := &model.Invoice{}
	query := `
		SELECT id, organization_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax, discount, total, notes, created_at, updated_at
		FROM invoices
		WHERE id = $1 AND organization_id = $2
	`
	err := r.db.QueryRow(query, id, organizationID).Scan(
		&invoice.ID, &invoice.OrganizationID, &invoice.CustomerID, &invoice.InvoiceNumber,
		&invoice.Status, &invoice.IssueDate, &invoice.DueDate, &invoice.Subtotal, &invoice.Tax,
		&invoice.Discount, &invoice.Total, &invoice.Notes, &invoice.CreatedAt, &invoice.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("invoice not found")
	}
	if err != nil {
		return nil, err
	}
	return invoice, nil
}

func (r *InvoiceRepository) List(organizationID int, status string, page, limit int) ([]model.Invoice, int, error) {
	offset := (page - 1) * limit
	
	whereClause := "WHERE organization_id = $1"
	args := []interface{}{organizationID}
	argCount := 1
	
	if status != "" {
		argCount++
		whereClause += fmt.Sprintf(" AND status = $%d", argCount)
		args = append(args, status)
	}
	
	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM invoices %s", whereClause)
	err := r.db.QueryRow(countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}
	
	query := fmt.Sprintf(`
		SELECT id, organization_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax, discount, total, notes, created_at, updated_at
		FROM invoices
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
	
	invoices := []model.Invoice{}
	for rows.Next() {
		var invoice model.Invoice
		err := rows.Scan(
			&invoice.ID, &invoice.OrganizationID, &invoice.CustomerID, &invoice.InvoiceNumber,
			&invoice.Status, &invoice.IssueDate, &invoice.DueDate, &invoice.Subtotal, &invoice.Tax,
			&invoice.Discount, &invoice.Total, &invoice.Notes, &invoice.CreatedAt, &invoice.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		invoices = append(invoices, invoice)
	}
	
	return invoices, total, nil
}

func (r *InvoiceRepository) GenerateInvoiceNumber(organizationID int, year int) (string, error) {
	var count int
	query := `
		SELECT COUNT(*) FROM invoices 
		WHERE organization_id = $1 AND EXTRACT(YEAR FROM created_at) = $2
	`
	err := r.db.QueryRow(query, organizationID, year).Scan(&count)
	if err != nil {
		return "", err
	}
	
	return fmt.Sprintf("INV-%d-%06d", year, count+1), nil
}

func (r *InvoiceRepository) CreateItem(item *model.InvoiceItem) error {
	query := `
		INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, subtotal)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`
	return r.db.QueryRow(
		query,
		item.InvoiceID, item.ProductID, item.Description, item.Quantity, item.UnitPrice, item.Subtotal,
	).Scan(&item.ID, &item.CreatedAt)
}

func (r *InvoiceRepository) DeleteItems(invoiceID int) error {
	query := `DELETE FROM invoice_items WHERE invoice_id = $1`
	_, err := r.db.Exec(query, invoiceID)
	return err
}

func (r *InvoiceRepository) GetItems(invoiceID int) ([]model.InvoiceItem, error) {
	query := `
		SELECT id, invoice_id, product_id, description, quantity, unit_price, subtotal, created_at
		FROM invoice_items
		WHERE invoice_id = $1
	`
	rows, err := r.db.Query(query, invoiceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	items := []model.InvoiceItem{}
	for rows.Next() {
		var item model.InvoiceItem
		err := rows.Scan(
			&item.ID, &item.InvoiceID, &item.ProductID, &item.Description,
			&item.Quantity, &item.UnitPrice, &item.Subtotal, &item.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	
	return items, nil
}

func (r *InvoiceRepository) GetDashboardStats(organizationID int) (*model.DashboardStats, error) {
	stats := &model.DashboardStats{}
	
	query := `
		SELECT 
			COALESCE(SUM(CASE WHEN status = 'paid' THEN total ELSE 0 END), 0) as revenue,
			COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_invoices,
			COUNT(CASE WHEN status IN ('sent', 'draft') THEN 1 END) as unpaid_invoices,
			COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_invoices
		FROM invoices
		WHERE organization_id = $1
	`
	err := r.db.QueryRow(query, organizationID).Scan(
		&stats.Revenue, &stats.PaidInvoices, &stats.UnpaidInvoices, &stats.OverdueInvoices,
	)
	if err != nil {
		return nil, err
	}
	
	return stats, nil
}

func (r *InvoiceRepository) GetRevenueChart(organizationID int, days int) ([]model.RevenueChartData, error) {
	query := `
		SELECT DATE(paid_at) as date, COALESCE(SUM(amount), 0) as amount
		FROM payments
		WHERE organization_id = $1 AND paid_at >= CURRENT_DATE - $2 * INTERVAL '1 day'
		GROUP BY DATE(paid_at)
		ORDER BY date ASC
	`
	
	rows, err := r.db.Query(query, organizationID, days)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	data := []model.RevenueChartData{}
	for rows.Next() {
		var d model.RevenueChartData
		var dateStr string
		err := rows.Scan(&dateStr, &d.Amount)
		if err != nil {
			return nil, err
		}
		d.Date, _ = time.Parse("2006-01-02", dateStr)
		data = append(data, d)
	}
	
	return data, nil
}
