package middleware

import (
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

// IPRateLimiter manages rate limiters per IP address
type IPRateLimiter struct {
	ips map[string]*rate.Limiter
	mu  *sync.RWMutex
	r   rate.Limit
	b   int
}

// NewIPRateLimiter creates a new rate limiter
// r: requests per second (use rate.Every(time.Minute/5) for 5 requests per minute)
// b: burst size (max requests at once)
func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	return &IPRateLimiter{
		ips: make(map[string]*rate.Limiter),
		mu:  &sync.RWMutex{},
		r:   r,
		b:   b,
	}
}

// GetLimiter returns the rate limiter for an IP address
func (i *IPRateLimiter) GetLimiter(ip string) *rate.Limiter {
	i.mu.Lock()
	defer i.mu.Unlock()

	limiter, exists := i.ips[ip]
	if !exists {
		limiter = rate.NewLimiter(i.r, i.b)
		i.ips[ip] = limiter
	}

	return limiter
}

// CleanupOldEntries removes old entries to prevent memory leak
// Call this periodically in a goroutine
func (i *IPRateLimiter) CleanupOldEntries() {
	i.mu.Lock()
	defer i.mu.Unlock()
	
	// Simple cleanup: clear all entries periodically
	// In production, use more sophisticated cleanup
	i.ips = make(map[string]*rate.Limiter)
}

// RateLimitMiddleware creates a rate limiting middleware
func RateLimitMiddleware(limiter *IPRateLimiter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get IP from request
			ip := r.RemoteAddr
			
			// Get rate limiter for this IP
			rateLimiter := limiter.GetLimiter(ip)
			
			// Check if request is allowed
			if !rateLimiter.Allow() {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error":"Terlalu banyak permintaan. Coba lagi nanti."}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
