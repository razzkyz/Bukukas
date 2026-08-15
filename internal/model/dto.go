package model

import "time"

// DTOs for requests and responses

// RegisterRequest represents a registration request
type RegisterRequest struct {
	Name             string `json:"name"`
	Email            string `json:"email"`
	Password         string `json:"password"`
	OrganizationName string `json:"organization_name"`
}

// LoginRequest represents a login request
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// AuthResponse represents an authentication response
type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// CreateCustomerRequest represents a request to create a customer
type CreateCustomerRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}

// UpdateCustomerRequest represents a request to update a customer
type UpdateCustomerRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}

// CreateProductRequest represents a request to create a product
type CreateProductRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Unit        string  `json:"unit"`
}

// UpdateProductRequest represents a request to update a product
type UpdateProductRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Unit        string  `json:"unit"`
}

// InvoiceItemRequest represents an invoice item in a request
type InvoiceItemRequest struct {
	ProductID   *int    `json:"product_id"`
	Description string  `json:"description"`
	Quantity    float64 `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
}

// CreateInvoiceRequest represents a request to create an invoice
type CreateInvoiceRequest struct {
	CustomerID  int                  `json:"customer_id"`
	IssueDate   string               `json:"issue_date"`
	DueDate     string               `json:"due_date"`
	Items       []InvoiceItemRequest `json:"items"`
	Tax         float64              `json:"tax"`
	Discount    float64              `json:"discount"`
	Notes       string               `json:"notes"`
}

// UpdateInvoiceRequest represents a request to update an invoice
type UpdateInvoiceRequest struct {
	CustomerID  int                  `json:"customer_id"`
	IssueDate   string               `json:"issue_date"`
	DueDate     string               `json:"due_date"`
	Items       []InvoiceItemRequest `json:"items"`
	Tax         float64              `json:"tax"`
	Discount    float64              `json:"discount"`
	Notes       string               `json:"notes"`
}

// CreatePaymentRequest represents a request to create a payment
type CreatePaymentRequest struct {
	Amount        float64 `json:"amount"`
	PaymentMethod string  `json:"payment_method"`
	PaidAt        string  `json:"paid_at"`
	Notes         string  `json:"notes"`
}

// InvoiceWithDetails represents an invoice with all its details
type InvoiceWithDetails struct {
	Invoice      Invoice       `json:"invoice"`
	Customer     Customer      `json:"customer"`
	Items        []InvoiceItem `json:"items"`
	Payments     []Payment     `json:"payments"`
	TotalPaid    float64       `json:"total_paid"`
	AmountDue    float64       `json:"amount_due"`
}

// DashboardStats represents dashboard statistics
type DashboardStats struct {
	Revenue        float64 `json:"revenue"`
	PaidInvoices   int     `json:"paid_invoices"`
	UnpaidInvoices int     `json:"unpaid_invoices"`
	OverdueInvoices int    `json:"overdue_invoices"`
	TotalCustomers int     `json:"total_customers"`
}

// RevenueChartData represents revenue chart data
type RevenueChartData struct {
	Date   time.Time `json:"date"`
	Amount float64   `json:"amount"`
}

// PaginationParams represents pagination parameters
type PaginationParams struct {
	Page  int
	Limit int
}

// PaginationResponse represents pagination metadata
type PaginationResponse struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
}
