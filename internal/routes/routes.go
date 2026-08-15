package routes

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
	"invoice-saas/internal/handler"
	"invoice-saas/internal/middleware"
	"invoice-saas/internal/repository"
	"invoice-saas/internal/service"
)

// Setup creates routes without rate limiting (backward compatibility)
func Setup(db *sql.DB, jwtSecret string) *mux.Router {
	return SetupWithRateLimiter(db, jwtSecret, nil, nil)
}

// SetupWithRateLimiter creates routes with rate limiting
func SetupWithRateLimiter(db *sql.DB, jwtSecret string, authLimiter, apiLimiter *middleware.IPRateLimiter) *mux.Router {
	router := mux.NewRouter()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)
	orgRepo := repository.NewOrganizationRepository(db)
	customerRepo := repository.NewCustomerRepository(db)
	productRepo := repository.NewProductRepository(db)
	invoiceRepo := repository.NewInvoiceRepository(db)
	paymentRepo := repository.NewPaymentRepository(db)

	// Initialize services
	authService := service.NewAuthService(userRepo, orgRepo, jwtSecret)
	customerService := service.NewCustomerService(customerRepo)
	productService := service.NewProductService(productRepo)
	invoiceService := service.NewInvoiceService(invoiceRepo, customerRepo, paymentRepo)
	paymentService := service.NewPaymentService(paymentRepo, invoiceRepo)
	dashboardService := service.NewDashboardService(invoiceRepo, customerRepo)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	customerHandler := handler.NewCustomerHandler(customerService)
	productHandler := handler.NewProductHandler(productService)
	invoiceHandler := handler.NewInvoiceHandler(invoiceService)
	paymentHandler := handler.NewPaymentHandler(paymentService)
	dashboardHandler := handler.NewDashboardHandler(dashboardService)

	// Public routes with rate limiting (protect against brute force)
	if authLimiter != nil {
		authRouter := router.PathPrefix("/api/auth").Subrouter()
		authRouter.Use(func(next http.Handler) http.Handler {
			return middleware.RateLimitMiddleware(authLimiter)(next)
		})
		authRouter.HandleFunc("/register", authHandler.Register).Methods("POST")
		authRouter.HandleFunc("/login", authHandler.Login).Methods("POST")
	} else {
		// Fallback without rate limiting
		router.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
		router.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")
	}

	// Protected routes with API rate limiting
	protected := router.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	
	if apiLimiter != nil {
		protected.Use(func(next http.Handler) http.Handler {
			return middleware.RateLimitMiddleware(apiLimiter)(next)
		})
	}

	// Auth routes
	protected.HandleFunc("/auth/me", authHandler.GetCurrentUser).Methods("GET")
	protected.HandleFunc("/auth/logout", authHandler.Logout).Methods("POST")

	// Customer routes
	protected.HandleFunc("/customers", customerHandler.List).Methods("GET")
	protected.HandleFunc("/customers", customerHandler.Create).Methods("POST")
	protected.HandleFunc("/customers/{id}", customerHandler.GetByID).Methods("GET")
	protected.HandleFunc("/customers/{id}", customerHandler.Update).Methods("PUT")
	protected.HandleFunc("/customers/{id}", customerHandler.Delete).Methods("DELETE")

	// Product routes
	protected.HandleFunc("/products", productHandler.List).Methods("GET")
	protected.HandleFunc("/products", productHandler.Create).Methods("POST")
	protected.HandleFunc("/products/{id}", productHandler.GetByID).Methods("GET")
	protected.HandleFunc("/products/{id}", productHandler.Update).Methods("PUT")
	protected.HandleFunc("/products/{id}", productHandler.Delete).Methods("DELETE")

	// Invoice routes
	protected.HandleFunc("/invoices", invoiceHandler.List).Methods("GET")
	protected.HandleFunc("/invoices", invoiceHandler.Create).Methods("POST")
	protected.HandleFunc("/invoices/{id}", invoiceHandler.GetByID).Methods("GET")
	protected.HandleFunc("/invoices/{id}", invoiceHandler.Update).Methods("PUT")
	protected.HandleFunc("/invoices/{id}", invoiceHandler.Delete).Methods("DELETE")
	protected.HandleFunc("/invoices/{id}/send", invoiceHandler.Send).Methods("POST")
	protected.HandleFunc("/invoices/{id}/cancel", invoiceHandler.Cancel).Methods("POST")

	// Payment routes
	protected.HandleFunc("/invoices/{id}/payments", paymentHandler.GetByInvoiceID).Methods("GET")
	protected.HandleFunc("/invoices/{id}/payments", paymentHandler.Create).Methods("POST")

	// Dashboard routes
	protected.HandleFunc("/dashboard/stats", dashboardHandler.GetStats).Methods("GET")
	protected.HandleFunc("/dashboard/revenue-chart", dashboardHandler.GetRevenueChart).Methods("GET")

	return router
}
