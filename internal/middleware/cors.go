package middleware

import (
	"net/http"

	"github.com/rs/cors"
)

// CORSMiddleware creates a CORS middleware
func CORSMiddleware(allowedOrigin string) func(http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{allowedOrigin},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	return c.Handler
}
