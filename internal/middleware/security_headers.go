package middleware

import (
	"net/http"
	"os"
)

// SecurityHeadersMiddleware adds security headers to all responses
func SecurityHeadersMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Prevent clickjacking attacks
			w.Header().Set("X-Frame-Options", "DENY")
			
			// Prevent MIME type sniffing
			w.Header().Set("X-Content-Type-Options", "nosniff")
			
			// Enable XSS protection (legacy browsers)
			w.Header().Set("X-XSS-Protection", "1; mode=block")
			
			// Content Security Policy (adjust based on your needs)
			w.Header().Set("Content-Security-Policy", "default-src 'self'")
			
			// Referrer Policy
			w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
			
			// HTTPS Strict Transport Security (only in production)
			if os.Getenv("APP_ENV") == "production" {
				w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
			}
			
			// Permissions Policy (formerly Feature Policy)
			w.Header().Set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")

			next.ServeHTTP(w, r)
		})
	}
}
