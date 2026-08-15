package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"invoice-saas/internal/middleware"
	"invoice-saas/internal/routes"
	"invoice-saas/pkg/database"
	"invoice-saas/pkg/logger"
	"invoice-saas/internal/config"
	
	"golang.org/x/time/rate"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		logger.Errorf("Failed to load configuration: %v", err)
		return
	}

	logger.Infof("Starting BukuKas application in %s mode", cfg.AppEnv)

	// Connect to database
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		logger.Errorf("Failed to connect to database: %v", err)
		return
	}
	defer db.Close()

	logger.Info("Connected to database successfully")

	// Run migrations
	if err := database.RunMigrations(db, "migrations"); err != nil {
		logger.Errorf("Failed to run migrations: %v", err)
		return
	}

	// Setup rate limiters
	// Auth endpoints: 5 requests per minute (protection against brute force)
	authLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/5), 5)
	
	// API endpoints: 100 requests per minute (normal usage)
	apiLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/100), 100)
	
	// Cleanup old rate limiter entries every hour
	go func() {
		ticker := time.NewTicker(1 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			authLimiter.CleanupOldEntries()
			apiLimiter.CleanupOldEntries()
		}
	}()

	// Setup routes with rate limiters
	router := routes.SetupWithRateLimiter(db, cfg.JWTSecret, authLimiter, apiLimiter)

	// Apply global middleware (order matters!)
	handler := middleware.SecurityHeadersMiddleware()(router)
	handler = middleware.LoggerMiddleware(handler)
	handler = middleware.CORSMiddleware(cfg.CORSOrigin)(handler)

	// Get port from environment variable (required for Render deployment)
	// Render automatically sets PORT env var
	port := os.Getenv("PORT")
	if port == "" {
		port = cfg.AppPort // Use config port for local development
	}
	
	addr := fmt.Sprintf(":%s", port)
	logger.Infof("Server starting on %s", addr)
	logger.Infof("CORS enabled for: %s", cfg.CORSOrigin)
	logger.Infof("Security features enabled:")
	logger.Info("  ✓ Rate limiting (Auth: 5/min, API: 100/min)")
	logger.Info("  ✓ Security headers")
	logger.Info("  ✓ SQL injection protection (parameterized queries)")
	logger.Info("  ✓ JWT authentication")

	if err := http.ListenAndServe(addr, handler); err != nil {
		logger.Errorf("Server failed to start: %v", err)
	}
}
