# 💳 Integrasi Payment Gateway DOKU - BukuKas

**Payment Gateway:** DOKU (Sandbox for development)  
**Tier Pricing:** Rp 5.000, 10.000, 20.000, 30.000  
**Status:** Backend & Frontend Integration Required

---

## 🎯 Pricing Tiers

| Tier | Price | Invoice Limit | Features |
|------|-------|---------------|----------|
| **Starter** | Rp 5.000/bulan | 5 invoice/bulan | 10 customer, 10 produk, dashboard basic |
| **Basic** | Rp 10.000/bulan | 20 invoice/bulan | 50 customer, 50 produk, email notification |
| **Pro** | Rp 20.000/bulan | Unlimited | Unlimited everything, WhatsApp, multi-user (3) |
| **Enterprise** | Rp 30.000/bulan | Unlimited | Custom domain, API, white label, unlimited users |

**Trial:** 7 hari gratis untuk semua paket!

---

## 📱 Frontend (Sudah Dibuat!)

### **Halaman Pricing**

**File:** `frontend/src/pages/Pricing.tsx`

**URL:** `http://localhost:3000/pricing`

**Fitur:**
- ✅ 4 pricing cards (Starter, Basic, Pro, Enterprise)
- ✅ Popular badge untuk paket Basic
- ✅ Button "Berlangganan" dengan loading state
- ✅ SweetAlert untuk konfirmasi & notifikasi
- ✅ Auto-redirect ke DOKU payment page
- ✅ FAQ section

**Flow User:**
1. User klik "Berlangganan Sekarang" pada tier yang dipilih
2. Jika belum login → redirect ke `/login`
3. Jika sudah login → call API `/payments/create-subscription`
4. Backend create payment di DOKU → return `payment_url`
5. User confirm → redirect ke DOKU payment page
6. User bayar → DOKU callback ke backend
7. Backend update subscription status

---

## 🔧 Backend Integration (Need to Build!)

### **Step 1: Install DOKU SDK**

```bash
cd backend
go get github.com/PTNUSASATUINTIARTHA-DOKU/doku-go-sdk
```

### **Step 2: Environment Variables**

**File:** `.env`

```env
# DOKU Configuration (Sandbox)
DOKU_CLIENT_ID=your-sandbox-client-id
DOKU_SECRET_KEY=your-sandbox-secret-key
DOKU_ENVIRONMENT=sandbox  # production for live
DOKU_CALLBACK_URL=http://localhost:8080/api/payments/doku-callback
DOKU_REDIRECT_URL=http://localhost:3000/payment-success
```

**Get credentials:**
1. Register di https://sandbox.doku.com/
2. Create merchant account
3. Copy Client ID & Secret Key dari dashboard

---

### **Step 3: Database Schema (Subscription & Payment)**

**Create migration:** `migrations/008_create_subscriptions_table.sql`

```sql
-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL, -- 'starter', 'basic', 'pro', 'enterprise'
    status VARCHAR(50) NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'expired', 'cancelled'
    amount INTEGER NOT NULL, -- in Rupiah
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed', 'expired'
    payment_method VARCHAR(50), -- 'virtual_account', 'credit_card', 'ewallet'
    payment_channel VARCHAR(50), -- 'bca', 'mandiri', 'gopay', 'ovo', etc
    doku_invoice_number VARCHAR(100),
    doku_payment_url TEXT,
    paid_at TIMESTAMP,
    expired_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_org ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payment_transactions_org ON payment_transactions(organization_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_invoice ON payment_transactions(invoice_number);
```

---

### **Step 4: Backend Models**

**File:** `internal/model/subscription.go`

```go
package model

import "time"

type Subscription struct {
	ID             int       `json:"id"`
	OrganizationID int       `json:"organization_id"`
	PlanID         string    `json:"plan_id"` // starter, basic, pro, enterprise
	Status         string    `json:"status"`  // trial, active, expired, cancelled
	Amount         int       `json:"amount"`
	StartDate      time.Time `json:"start_date"`
	EndDate        time.Time `json:"end_date"`
	TrialEndDate   time.Time `json:"trial_end_date"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type PaymentTransaction struct {
	ID                int       `json:"id"`
	OrganizationID    int       `json:"organization_id"`
	SubscriptionID    *int      `json:"subscription_id"`
	InvoiceNumber     string    `json:"invoice_number"`
	Amount            int       `json:"amount"`
	Status            string    `json:"status"` // pending, success, failed, expired
	PaymentMethod     string    `json:"payment_method"`
	PaymentChannel    string    `json:"payment_channel"`
	DokuInvoiceNumber string    `json:"doku_invoice_number"`
	DokuPaymentURL    string    `json:"doku_payment_url"`
	PaidAt            *time.Time `json:"paid_at"`
	ExpiredAt         time.Time  `json:"expired_at"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

type CreateSubscriptionRequest struct {
	PlanID string `json:"plan_id" validate:"required"`
	Amount int    `json:"amount" validate:"required,min=5000"`
}

type CreateSubscriptionResponse struct {
	InvoiceNumber string `json:"invoice_number"`
	PaymentURL    string `json:"payment_url"`
	Amount        int    `json:"amount"`
	ExpiredAt     string `json:"expired_at"`
}
```

---

### **Step 5: DOKU Service**

**File:** `internal/service/doku_service.go`

```go
package service

import (
	"fmt"
	"time"
	"os"
	
	doku "github.com/PTNUSASATUINTIARTHA-DOKU/doku-go-sdk"
)

type DokuService struct {
	client *doku.Client
}

func NewDokuService() *DokuService {
	client := doku.NewClient(
		os.Getenv("DOKU_CLIENT_ID"),
		os.Getenv("DOKU_SECRET_KEY"),
		os.Getenv("DOKU_ENVIRONMENT"), // "sandbox" or "production"
	)
	
	return &DokuService{client: client}
}

// CreatePayment creates a payment request in DOKU
func (s *DokuService) CreatePayment(invoiceNumber string, amount int, customerEmail string) (string, error) {
	// Create payment request
	request := doku.PaymentRequest{
		Order: doku.Order{
			InvoiceNumber: invoiceNumber,
			Amount:        amount,
			Currency:      "IDR",
		},
		Customer: doku.Customer{
			Email: customerEmail,
		},
		Payment: doku.Payment{
			PaymentDueDate: time.Now().Add(24 * time.Hour).Unix(), // 24 hours
		},
		AdditionalInfo: doku.AdditionalInfo{
			Channel: "VIRTUAL_ACCOUNT_BCA", // or let user choose
		},
	}
	
	// Call DOKU API
	response, err := s.client.CreatePayment(request)
	if err != nil {
		return "", fmt.Errorf("doku payment failed: %w", err)
	}
	
	return response.PaymentURL, nil
}

// VerifyCallback verifies DOKU callback signature
func (s *DokuService) VerifyCallback(signature string, body string) bool {
	return s.client.VerifySignature(signature, body)
}
```

---

### **Step 6: Payment Handler**

**File:** `internal/handler/payment_handler.go`

```go
package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"invoice-saas/internal/middleware"
	"invoice-saas/internal/model"
	"invoice-saas/internal/service"
	"invoice-saas/pkg/response"
)

type PaymentHandler struct {
	paymentService *service.PaymentService
	dokuService    *service.DokuService
}

func NewPaymentHandler(paymentService *service.PaymentService, dokuService *service.DokuService) *PaymentHandler {
	return &PaymentHandler{
		paymentService: paymentService,
		dokuService:    dokuService,
	}
}

// CreateSubscription creates a subscription payment
func (h *PaymentHandler) CreateSubscription(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	var req model.CreateSubscriptionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request")
		return
	}

	// Validate plan
	if req.PlanID != "starter" && req.PlanID != "basic" && req.PlanID != "pro" && req.PlanID != "enterprise" {
		response.BadRequest(w, "Invalid plan")
		return
	}

	// Generate invoice number
	invoiceNumber := fmt.Sprintf("SUB-%d-%d", claims.OrganizationID, time.Now().Unix())

	// Create payment in DOKU
	paymentURL, err := h.dokuService.CreatePayment(invoiceNumber, req.Amount, claims.Email)
	if err != nil {
		response.InternalError(w, "Failed to create payment")
		return
	}

	// Save to database
	transaction := &model.PaymentTransaction{
		OrganizationID:  claims.OrganizationID,
		InvoiceNumber:   invoiceNumber,
		Amount:          req.Amount,
		Status:          "pending",
		DokuPaymentURL:  paymentURL,
		ExpiredAt:       time.Now().Add(24 * time.Hour),
	}

	if err := h.paymentService.CreateTransaction(transaction); err != nil {
		response.InternalError(w, "Failed to save transaction")
		return
	}

	// Response
	resp := model.CreateSubscriptionResponse{
		InvoiceNumber: invoiceNumber,
		PaymentURL:    paymentURL,
		Amount:        req.Amount,
		ExpiredAt:     transaction.ExpiredAt.Format(time.RFC3339),
	}

	response.Created(w, resp)
}

// DokuCallback handles DOKU payment callback
func (h *PaymentHandler) DokuCallback(w http.ResponseWriter, r *http.Request) {
	// Verify signature
	signature := r.Header.Get("X-DOKU-Signature")
	// body := ... read body
	
	// if !h.dokuService.VerifyCallback(signature, body) {
	// 	response.Unauthorized(w, "Invalid signature")
	// 	return
	// }

	// Parse callback data
	var callback struct {
		InvoiceNumber string `json:"invoice_number"`
		Status        string `json:"status"` // "SUCCESS", "FAILED"
		PaidAt        string `json:"paid_at"`
	}

	if err := json.NewDecoder(r.Body).Decode(&callback); err != nil {
		response.BadRequest(w, "Invalid callback")
		return
	}

	// Update payment status
	if callback.Status == "SUCCESS" {
		if err := h.paymentService.UpdateTransactionStatus(callback.InvoiceNumber, "success"); err != nil {
			response.InternalError(w, "Failed to update status")
			return
		}

		// Activate subscription
		// h.paymentService.ActivateSubscription(...)
	}

	response.Success(w, map[string]string{"message": "Callback processed"})
}
```

---

### **Step 7: Add Routes**

**File:** `internal/routes/routes.go`

```go
// Payment routes (protected)
protected.HandleFunc("/payments/create-subscription", paymentHandler.CreateSubscription).Methods("POST")

// DOKU callback (public)
router.HandleFunc("/api/payments/doku-callback", paymentHandler.DokuCallback).Methods("POST")
```

---

## 🧪 Testing (Sandbox)

### **1. Test Frontend**

```bash
cd frontend
npm run dev
```

**Open:** `http://localhost:3000/pricing`

**Test Flow:**
1. Klik "Berlangganan Sekarang" pada Basic (Rp 10.000)
2. Login jika diminta
3. Lihat invoice number & amount
4. Klik "Bayar Sekarang" → redirect ke DOKU sandbox

### **2. Test DOKU Sandbox Payment**

**Virtual Account (BCA):**
- VA Number: Akan digenerate otomatis
- Test payment: Gunakan DOKU sandbox simulator

**Test Credit Card:**
- Card Number: `4111111111111111`
- CVV: `123`
- Expiry: Any future date

### **3. Test Callback**

```bash
curl -X POST http://localhost:8080/api/payments/doku-callback \
  -H "Content-Type: application/json" \
  -H "X-DOKU-Signature: test-signature" \
  -d '{
    "invoice_number": "SUB-1-1234567890",
    "status": "SUCCESS",
    "paid_at": "2026-08-16T10:00:00Z"
  }'
```

---

## 📊 Subscription Logic

### **Trial Period (7 Days)**

```go
func CreateSubscription(orgID int, planID string) {
  subscription := &Subscription{
    OrganizationID: orgID,
    PlanID:         planID,
    Status:         "trial",
    TrialEndDate:   time.Now().Add(7 * 24 * time.Hour),
  }
  // Save to DB
}
```

### **Check Subscription Status**

```go
func CanCreateInvoice(orgID int) bool {
  subscription := GetActiveSubscription(orgID)
  
  if subscription == nil {
    return false // No subscription
  }
  
  if subscription.Status == "trial" && time.Now().After(subscription.TrialEndDate) {
    return false // Trial expired
  }
  
  if subscription.Status == "active" && time.Now().After(subscription.EndDate) {
    return false // Subscription expired
  }
  
  // Check invoice limit based on plan
  invoiceCount := GetInvoiceCount(orgID, subscription.StartDate)
  
  switch subscription.PlanID {
  case "starter":
    return invoiceCount < 5
  case "basic":
    return invoiceCount < 20
  case "pro", "enterprise":
    return true // Unlimited
  }
  
  return false
}
```

---

## 🚀 Production Checklist

- [ ] Change DOKU environment to `production`
- [ ] Use real DOKU Client ID & Secret Key
- [ ] Update callback URL to production domain
- [ ] Test all payment methods (VA, Credit Card, E-Wallet)
- [ ] Setup auto-renewal (monthly billing)
- [ ] Setup email notification (payment success, subscription expiring)
- [ ] Setup webhook retry logic (callback gagal)
- [ ] Monitor payment success rate
- [ ] Setup refund logic
- [ ] Add invoice PDF generation for payment receipt

---

**Dibuat oleh:** BukuKas Development Team  
**Tanggal:** 2026-08-16  
**Status:** ⚠️ Backend Integration Required

