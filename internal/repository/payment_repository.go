package repository

import (
	"database/sql"

	"invoice-saas/internal/model"
)

type PaymentRepository struct {
	db *sql.DB
}

func NewPaymentRepository(db *sql.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(payment *model.Payment) error {
	query := `
		INSERT INTO payments (organization_id, invoice_id, amount, payment_method, paid_at, notes)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at
	`
	return r.db.QueryRow(
		query,
		payment.OrganizationID, payment.InvoiceID, payment.Amount,
		payment.PaymentMethod, payment.PaidAt, payment.Notes,
	).Scan(&payment.ID, &payment.CreatedAt)
}

func (r *PaymentRepository) GetByInvoiceID(invoiceID, organizationID int) ([]model.Payment, error) {
	query := `
		SELECT id, organization_id, invoice_id, amount, payment_method, paid_at, notes, created_at
		FROM payments
		WHERE invoice_id = $1 AND organization_id = $2
		ORDER BY paid_at DESC
	`
	rows, err := r.db.Query(query, invoiceID, organizationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	payments := []model.Payment{}
	for rows.Next() {
		var payment model.Payment
		err := rows.Scan(
			&payment.ID, &payment.OrganizationID, &payment.InvoiceID, &payment.Amount,
			&payment.PaymentMethod, &payment.PaidAt, &payment.Notes, &payment.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		payments = append(payments, payment)
	}
	
	return payments, nil
}

func (r *PaymentRepository) GetTotalPaid(invoiceID, organizationID int) (float64, error) {
	var total float64
	query := `
		SELECT COALESCE(SUM(amount), 0)
		FROM payments
		WHERE invoice_id = $1 AND organization_id = $2
	`
	err := r.db.QueryRow(query, invoiceID, organizationID).Scan(&total)
	return total, err
}
