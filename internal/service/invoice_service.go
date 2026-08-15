package service

import (
	"fmt"
	"time"

	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
	"invoice-saas/pkg/validator"
)

type InvoiceService struct {
	invoiceRepo  *repository.InvoiceRepository
	customerRepo *repository.CustomerRepository
	paymentRepo  *repository.PaymentRepository
}

func NewInvoiceService(invoiceRepo *repository.InvoiceRepository, customerRepo *repository.CustomerRepository, paymentRepo *repository.PaymentRepository) *InvoiceService {
	return &InvoiceService{
		invoiceRepo:  invoiceRepo,
		customerRepo: customerRepo,
		paymentRepo:  paymentRepo,
	}
}

func (s *InvoiceService) Create(organizationID int, req *model.CreateInvoiceRequest) (*model.Invoice, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	// Validate customer
	if req.CustomerID <= 0 {
		errors.Add("customer_id", "Customer is required")
	}

	// Validate dates
	issueDate, err := time.Parse("2006-01-02", req.IssueDate)
	if err != nil {
		errors.Add("issue_date", "Invalid issue date format")
	}

	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		errors.Add("due_date", "Invalid due date format")
	}

	// Validate items
	if len(req.Items) == 0 {
		errors.Add("items", "At least one item is required")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Verify customer belongs to organization
	_, err = s.customerRepo.FindByID(req.CustomerID, organizationID)
	if err != nil {
		errors.Add("customer_id", "Customer not found")
		return nil, errors
	}

	// Calculate totals
	subtotal := 0.0
	for _, item := range req.Items {
		if item.Quantity <= 0 {
			errors.Add("items", "Item quantity must be greater than zero")
		}
		if item.UnitPrice < 0 {
			errors.Add("items", "Item price cannot be negative")
		}
		subtotal += item.Quantity * item.UnitPrice
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Calculate final total
	total := subtotal - req.Discount + req.Tax

	// Generate invoice number
	invoiceNumber, err := s.invoiceRepo.GenerateInvoiceNumber(organizationID, issueDate.Year())
	if err != nil {
		errors.Add("invoice_number", "Failed to generate invoice number")
		return nil, errors
	}

	// Create invoice
	invoice := &model.Invoice{
		OrganizationID: organizationID,
		CustomerID:     req.CustomerID,
		InvoiceNumber:  invoiceNumber,
		Status:         model.InvoiceStatusDraft,
		IssueDate:      issueDate,
		DueDate:        dueDate,
		Subtotal:       subtotal,
		Tax:            req.Tax,
		Discount:       req.Discount,
		Total:          total,
		Notes:          req.Notes,
	}

	if err := s.invoiceRepo.Create(invoice); err != nil {
		errors.Add("invoice", "Failed to create invoice")
		return nil, errors
	}

	// Create invoice items
	for _, itemReq := range req.Items {
		item := &model.InvoiceItem{
			InvoiceID:   invoice.ID,
			ProductID:   itemReq.ProductID,
			Description: itemReq.Description,
			Quantity:    itemReq.Quantity,
			UnitPrice:   itemReq.UnitPrice,
			Subtotal:    itemReq.Quantity * itemReq.UnitPrice,
		}
		if err := s.invoiceRepo.CreateItem(item); err != nil {
			errors.Add("items", "Failed to create invoice item")
			return nil, errors
		}
	}

	return invoice, nil
}

func (s *InvoiceService) Update(id, organizationID int, req *model.UpdateInvoiceRequest) (*model.Invoice, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	// Verify invoice exists
	invoice, err := s.invoiceRepo.FindByID(id, organizationID)
	if err != nil {
		errors.Add("invoice", "Invoice not found")
		return nil, errors
	}

	// Cannot update paid or cancelled invoices
	if invoice.Status == model.InvoiceStatusPaid || invoice.Status == model.InvoiceStatusCancelled {
		errors.Add("invoice", "Cannot update paid or cancelled invoices")
		return nil, errors
	}

	// Validate customer
	if req.CustomerID <= 0 {
		errors.Add("customer_id", "Customer is required")
	}

	// Validate dates
	issueDate, err := time.Parse("2006-01-02", req.IssueDate)
	if err != nil {
		errors.Add("issue_date", "Invalid issue date format")
	}

	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		errors.Add("due_date", "Invalid due date format")
	}

	// Validate items
	if len(req.Items) == 0 {
		errors.Add("items", "At least one item is required")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Verify customer belongs to organization
	_, err = s.customerRepo.FindByID(req.CustomerID, organizationID)
	if err != nil {
		errors.Add("customer_id", "Customer not found")
		return nil, errors
	}

	// Calculate totals
	subtotal := 0.0
	for _, item := range req.Items {
		if item.Quantity <= 0 {
			errors.Add("items", "Item quantity must be greater than zero")
		}
		if item.UnitPrice < 0 {
			errors.Add("items", "Item price cannot be negative")
		}
		subtotal += item.Quantity * item.UnitPrice
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Calculate final total
	total := subtotal - req.Discount + req.Tax

	// Update invoice
	invoice.CustomerID = req.CustomerID
	invoice.IssueDate = issueDate
	invoice.DueDate = dueDate
	invoice.Subtotal = subtotal
	invoice.Tax = req.Tax
	invoice.Discount = req.Discount
	invoice.Total = total
	invoice.Notes = req.Notes

	if err := s.invoiceRepo.Update(invoice); err != nil {
		errors.Add("invoice", "Failed to update invoice")
		return nil, errors
	}

	// Delete old items and create new ones
	if err := s.invoiceRepo.DeleteItems(invoice.ID); err != nil {
		errors.Add("items", "Failed to update invoice items")
		return nil, errors
	}

	for _, itemReq := range req.Items {
		item := &model.InvoiceItem{
			InvoiceID:   invoice.ID,
			ProductID:   itemReq.ProductID,
			Description: itemReq.Description,
			Quantity:    itemReq.Quantity,
			UnitPrice:   itemReq.UnitPrice,
			Subtotal:    itemReq.Quantity * itemReq.UnitPrice,
		}
		if err := s.invoiceRepo.CreateItem(item); err != nil {
			errors.Add("items", "Failed to create invoice item")
			return nil, errors
		}
	}

	updated, err := s.invoiceRepo.FindByID(id, organizationID)
	if err != nil {
		errors.Add("invoice", "Failed to retrieve updated invoice")
		return nil, errors
	}

	return updated, nil
}

func (s *InvoiceService) Delete(id, organizationID int) error {
	return s.invoiceRepo.Delete(id, organizationID)
}

func (s *InvoiceService) GetByID(id, organizationID int) (*model.InvoiceWithDetails, error) {
	invoice, err := s.invoiceRepo.FindByID(id, organizationID)
	if err != nil {
		return nil, err
	}

	customer, err := s.customerRepo.FindByID(invoice.CustomerID, organizationID)
	if err != nil {
		return nil, err
	}

	items, err := s.invoiceRepo.GetItems(invoice.ID)
	if err != nil {
		return nil, err
	}

	payments, err := s.paymentRepo.GetByInvoiceID(invoice.ID, organizationID)
	if err != nil {
		return nil, err
	}

	totalPaid, err := s.paymentRepo.GetTotalPaid(invoice.ID, organizationID)
	if err != nil {
		return nil, err
	}

	return &model.InvoiceWithDetails{
		Invoice:   *invoice,
		Customer:  *customer,
		Items:     items,
		Payments:  payments,
		TotalPaid: totalPaid,
		AmountDue: invoice.Total - totalPaid,
	}, nil
}

func (s *InvoiceService) List(organizationID int, status string, page, limit int) ([]model.Invoice, *model.PaginationResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	invoices, total, err := s.invoiceRepo.List(organizationID, status, page, limit)
	if err != nil {
		return nil, nil, err
	}

	totalPages := (total + limit - 1) / limit

	pagination := &model.PaginationResponse{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	return invoices, pagination, nil
}

func (s *InvoiceService) SendInvoice(id, organizationID int) error {
	invoice, err := s.invoiceRepo.FindByID(id, organizationID)
	if err != nil {
		return err
	}

	if invoice.Status != model.InvoiceStatusDraft {
		return fmt.Errorf("only draft invoices can be sent")
	}

	return s.invoiceRepo.UpdateStatus(id, organizationID, model.InvoiceStatusSent)
}

func (s *InvoiceService) CancelInvoice(id, organizationID int) error {
	invoice, err := s.invoiceRepo.FindByID(id, organizationID)
	if err != nil {
		return err
	}

	if invoice.Status == model.InvoiceStatusPaid {
		return fmt.Errorf("cannot cancel paid invoices")
	}

	return s.invoiceRepo.UpdateStatus(id, organizationID, model.InvoiceStatusCancelled)
}
