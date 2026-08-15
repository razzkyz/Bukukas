package middleware

import (
	"context"
	"net/http"
	"strings"

	"invoice-saas/pkg/auth"
	"invoice-saas/pkg/response"
)

type contextKey string

const (
	UserContextKey contextKey = "user"
)

// AuthMiddleware validates JWT tokens with strict security checks
func AuthMiddleware(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 1. Check Authorization header exists
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Unauthorized(w, "Authorization header required")
				return
			}

			// 2. Validate Bearer token format
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				response.Unauthorized(w, "Invalid authorization header format. Use: Bearer <token>")
				return
			}

			token := parts[1]
			
			// 3. Validate token is not empty
			if strings.TrimSpace(token) == "" {
				response.Unauthorized(w, "Token cannot be empty")
				return
			}

			// 4. Validate and parse JWT token (with strict checks in ValidateToken)
			claims, err := auth.ValidateToken(token, jwtSecret)
			if err != nil {
				response.Unauthorized(w, "Invalid or expired token: "+err.Error())
				return
			}

			// 5. Validate claims data integrity
			if claims.UserID <= 0 || claims.OrganizationID <= 0 {
				response.Unauthorized(w, "Invalid token claims")
				return
			}

			// 6. Validate email format
			if claims.Email == "" || !strings.Contains(claims.Email, "@") {
				response.Unauthorized(w, "Invalid token email")
				return
			}

			// Add validated claims to request context
			ctx := context.WithValue(r.Context(), UserContextKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserFromContext retrieves user claims from context
func GetUserFromContext(r *http.Request) *auth.Claims {
	claims, ok := r.Context().Value(UserContextKey).(*auth.Claims)
	if !ok {
		return nil
	}
	return claims
}
