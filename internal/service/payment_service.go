package service

import (
	"fmt"
	"time"

	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
	"invoice-saas/pkg/validator"
)

type PaymentService struct {
	paymentRepo *repository.PaymentRepository
	invoiceRepo *repository.InvoiceRepository
}

func NewPaymentService(paymentRepo *repository.PaymentRepository, invoiceRepo *repository.InvoiceRepository) *PaymentService {
	return &PaymentService{
		paymentRepo: paymentRepo,
		invoiceRepo: invoiceRepo,
	}
}

func (s *PaymentService) Create(organizationID, invoiceID int, req *model.CreatePaymentRequest) (*model.Payment, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	// Validate amount
	if req.Amount <= 0 {
		errors.Add("amount", "Amount must be greater than zero")
	}

	// Validate payment method
	validMethods := map[string]bool{
		model.PaymentMethodCash:         true,
		model.PaymentMethodBankTransfer: true,
		model.PaymentMethodQRIS:         true,
		model.PaymentMethodOther:        true,
	}
	if !validMethods[req.PaymentMethod] {
		errors.Add("payment_method", "Invalid payment method")
	}

	// Validate paid_at
	paidAt, err := time.Parse(time.RFC3339, req.PaidAt)
	if err != nil {
		errors.Add("paid_at", "Invalid date format")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Verify invoice exists and belongs to organization
	invoice, err := s.invoiceRepo.FindByID(invoiceID, organizationID)
	if err != nil {
		errors.Add("invoice", "Invoice not found")
		return nil, errors
	}

	// Cannot add payment to cancelled invoices
	if invoice.Status == model.InvoiceStatusCancelled {
		errors.Add("invoice", "Cannot add payment to cancelled invoice")
		return nil, errors
	}

	// Check if payment would exceed invoice total
	totalPaid, err := s.paymentRepo.GetTotalPaid(invoiceID, organizationID)
	if err != nil {
		errors.Add("amount", "Failed to calculate total paid")
		return nil, errors
	}

	if totalPaid+req.Amount > invoice.Total {
		errors.Add("amount", fmt.Sprintf("Payment exceeds invoice total. Remaining: %.2f", invoice.Total-totalPaid))
		return nil, errors
	}

	// Create payment
	payment := &model.Payment{
		OrganizationID: organizationID,
		InvoiceID:      invoiceID,
		Amount:         req.Amount,
		PaymentMethod:  req.PaymentMethod,
		PaidAt:         paidAt,
		Notes:          req.Notes,
	}

	if err := s.paymentRepo.Create(payment); err != nil {
		errors.Add("payment", "Failed to create payment")
		return nil, errors
	}

	// Update invoice status
	newTotalPaid := totalPaid + req.Amount
	if newTotalPaid >= invoice.Total {
		s.invoiceRepo.UpdateStatus(invoiceID, organizationID, model.InvoiceStatusPaid)
	} else if invoice.Status == model.InvoiceStatusDraft {
		s.invoiceRepo.UpdateStatus(invoiceID, organizationID, model.InvoiceStatusSent)
	}

	return payment, nil
}

func (s *PaymentService) GetByInvoiceID(invoiceID, organizationID int) ([]model.Payment, error) {
	// Verify invoice exists
	_, err := s.invoiceRepo.FindByID(invoiceID, organizationID)
	if err != nil {
		return nil, fmt.Errorf("invoice not found")
	}

	return s.paymentRepo.GetByInvoiceID(invoiceID, organizationID)
}
