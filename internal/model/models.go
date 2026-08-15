package model

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Organization represents a business using the SaaS
type Organization struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	Email     string    `json:"email,omitempty"`
	Phone     string    `json:"phone,omitempty"`
	Address   string    `json:"address,omitempty"`
	LogoURL   string    `json:"logo_url,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// OrganizationMember represents a user's membership in an organization
type OrganizationMember struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	UserID         int       `json:"user_id"`
	Role           string    `json:"role"`
	CreatedAt      time.Time `json:"created_at"`
}

// Customer represents a customer of an organization
type Customer struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	Name           string    `json:"name"`
	Email          string    `json:"email,omitempty"`
	Phone          string    `json:"phone,omitempty"`
	Address        string    `json:"address,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Product represents a product or service
type Product struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	Name           string    `json:"name"`
	Description    string    `json:"description,omitempty"`
	Price          float64   `json:"price"`
	Unit           string    `json:"unit"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// Invoice represents an invoice
type Invoice struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	CustomerID     int       `json:"customer_id"`
	InvoiceNumber  string    `json:"invoice_number"`
	Status         string    `json:"status"`
	IssueDate      time.Time `json:"issue_date"`
	DueDate        time.Time `json:"due_date"`
	Subtotal       float64   `json:"subtotal"`
	Tax            float64   `json:"tax"`
	Discount       float64   `json:"discount"`
	Total          float64   `json:"total"`
	Notes          string    `json:"notes,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// InvoiceItem represents an item in an invoice
type InvoiceItem struct {
	ID          int       `json:"id"`
	InvoiceID   int       `json:"invoice_id"`
	ProductID   *int      `json:"product_id,omitempty"`
	Description string    `json:"description"`
	Quantity    float64   `json:"quantity"`
	UnitPrice   float64   `json:"unit_price"`
	Subtotal    float64   `json:"subtotal"`
	CreatedAt   time.Time `json:"created_at"`
}

// Payment represents a payment for an invoice
type Payment struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	InvoiceID      int       `json:"invoice_id"`
	Amount         float64   `json:"amount"`
	PaymentMethod  string    `json:"payment_method"`
	PaidAt         time.Time `json:"paid_at"`
	Notes          string    `json:"notes,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
}

// Subscription represents an organization's subscription
type Subscription struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	Plan           string    `json:"plan"`
	Status         string    `json:"status"`
	StartedAt      time.Time `json:"started_at"`
	ExpiresAt      *time.Time `json:"expires_at,omitempty"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ActivityLog represents an activity log entry
type ActivityLog struct {
	ID             int                    `json:"id"`
	OrganizationID int                    `json:"organization_id"`
	UserID         *int                   `json:"user_id,omitempty"`
	Action         string                 `json:"action"`
	Entity         string                 `json:"entity"`
	EntityID       *int                   `json:"entity_id,omitempty"`
	Metadata       map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt      time.Time              `json:"created_at"`
}

// Constants for roles
const (
	RoleOwner = "owner"
	RoleAdmin = "admin"
	RoleStaff = "staff"
)

// Constants for invoice status
const (
	InvoiceStatusDraft     = "draft"
	InvoiceStatusSent      = "sent"
	InvoiceStatusPaid      = "paid"
	InvoiceStatusOverdue   = "overdue"
	InvoiceStatusCancelled = "cancelled"
)

// Constants for payment methods
const (
	PaymentMethodCash         = "cash"
	PaymentMethodBankTransfer = "bank_transfer"
	PaymentMethodQRIS         = "qris"
	PaymentMethodOther        = "other"
)

// Constants for subscription plans
const (
	PlanFree     = "free"
	PlanPro      = "pro"
	PlanBusiness = "business"
)

// Constants for subscription status
const (
	SubscriptionStatusActive    = "active"
	SubscriptionStatusCancelled = "cancelled"
	SubscriptionStatusExpired   = "expired"
)
