# 🔒 Security Improvements for BukuKas

## ✅ Current Security (Frontend)

### 1. **JWT Authentication**
- Token stored in localStorage
- Authorization header on every API request
- Auto-redirect to login on 401

### 2. **HTTPS Ready**
- Vite proxy configuration ready
- Production build supports HTTPS

### 3. **Input Validation (Client-side)**
- Form validation with required fields
- Email format validation
- Password minimum length (8 chars)

---

## 🚀 Backend Security Improvements Needed

### 1. **SQL Injection Prevention**

#### Current Risk:
Go backend might be vulnerable if using string concatenation for SQL queries.

#### Solution (Go Backend):
```go
// ❌ VULNERABLE (Don't do this!)
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)

// ✅ SAFE (Use parameterized queries)
query := "SELECT * FROM users WHERE email = $1"
row := db.QueryRow(query, email)

// ✅ SAFE (Use sqlc or prepared statements)
user, err := queries.GetUserByEmail(ctx, email)
```

**Files to check:**
- `internal/repository/*.go` - All database queries MUST use `$1, $2` placeholders
- Never concatenate user input into SQL strings

---

### 2. **Rate Limiting (Login Protection)**

#### Implementation in Go:

**Install package:**
```bash
cd backend
go get golang.org/x/time/rate
```

**Create middleware (`internal/middleware/rate_limiter.go`):**
```go
package middleware

import (
	"net/http"
	"sync"
	"time"
	"golang.org/x/time/rate"
)

type IPRateLimiter struct {
	ips map[string]*rate.Limiter
	mu  *sync.RWMutex
	r   rate.Limit
	b   int
}

func NewIPRateLimiter(r rate.Limit, b int) *IPRateLimiter {
	return &IPRateLimiter{
		ips: make(map[string]*rate.Limiter),
		mu:  &sync.RWMutex{},
		r:   r,
		b:   b,
	}
}

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

func RateLimit(limiter *IPRateLimiter) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr
			limiter := limiter.GetLimiter(ip)
			
			if !limiter.Allow() {
				http.Error(w, `{"error":"Rate limit exceeded. Try again later."}`, http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
```

**Usage in `cmd/server/main.go`:**
```go
// Rate limiter: 5 requests per minute for auth endpoints
authLimiter := middleware.NewIPRateLimiter(rate.Every(time.Minute/5), 5)

// Apply to auth routes
r.Route("/api/auth", func(r chi.Router) {
	r.Use(middleware.RateLimit(authLimiter))
	r.Post("/login", authHandler.Login)
	r.Post("/register", authHandler.Register)
})
```

**Configuration:**
- Login/Register: **5 attempts per minute per IP**
- Other API endpoints: **100 requests per minute per IP**

---

### 3. **Password Security Enhancements**

#### Current State:
- Bcrypt cost: 4 (too low for production!)

#### Improvements:

**Update `.env`:**
```env
# Development
BCRYPT_COST=4

# Production (MUST change to 10-12)
BCRYPT_COST=12
```

**In `pkg/auth/password.go`:**
```go
import (
	"os"
	"strconv"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	cost := bcrypt.DefaultCost // 10
	
	// Read from env (if set)
	if envCost := os.Getenv("BCRYPT_COST"); envCost != "" {
		if c, err := strconv.Atoi(envCost); err == nil {
			cost = c
		}
	}
	
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	return string(bytes), err
}
```

**Password Requirements:**
```go
func ValidatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	// Add more rules:
	// - At least 1 uppercase
	// - At least 1 number
	// - At least 1 special char
	return nil
}
```

---

### 4. **CORS Security**

**Update `internal/middleware/cors.go`:**
```go
func CORS() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			
			// Production: Only allow specific domains
			allowedOrigins := []string{
				"http://localhost:3000",      // Dev
				"https://yourdomain.com",     // Prod
				"https://www.yourdomain.com", // Prod
			}
			
			allowed := false
			for _, o := range allowedOrigins {
				if origin == o {
					allowed = true
					break
				}
			}
			
			if allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}
			
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	}
}
```

---

### 5. **JWT Security**

**Token Expiration:**
```go
// Short-lived access tokens
accessTokenExpiry := time.Now().Add(15 * time.Minute)

// Long-lived refresh tokens
refreshTokenExpiry := time.Now().Add(7 * 24 * time.Hour)
```

**Secure JWT Secret:**
```bash
# Generate strong secret (minimum 32 bytes)
openssl rand -base64 32
```

**In `.env`:**
```env
JWT_SECRET=your-super-strong-random-secret-min-32-chars
JWT_EXPIRY=15m
```

---

### 6. **Input Sanitization**

**Install validator:**
```bash
go get github.com/go-playground/validator/v10
```

**Usage:**
```go
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	
	// Validate
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		http.Error(w, "Validation failed", http.StatusBadRequest)
		return
	}
	
	// Sanitize email (lowercase, trim spaces)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	
	// Continue with login logic...
}
```

---

### 7. **HTTPS Enforcement (Production)**

**In `cmd/server/main.go`:**
```go
// Redirect HTTP to HTTPS in production
if os.Getenv("ENV") == "production" {
	go http.ListenAndServe(":80", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
	}))
}

// HTTPS server
log.Fatal(http.ListenAndServeTLS(":443", "cert.pem", "key.pem", r))
```

---

### 8. **Security Headers**

**Create `internal/middleware/security_headers.go`:**
```go
package middleware

import "net/http"

func SecurityHeaders() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Prevent clickjacking
			w.Header().Set("X-Frame-Options", "DENY")
			
			// Prevent MIME sniffing
			w.Header().Set("X-Content-Type-Options", "nosniff")
			
			// XSS Protection
			w.Header().Set("X-XSS-Protection", "1; mode=block")
			
			// HTTPS only (production)
			w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
			
			// Content Security Policy
			w.Header().Set("Content-Security-Policy", "default-src 'self'")
			
			next.ServeHTTP(w, r)
		})
	}
}
```

---

## 📁 Logo & Assets Setup

### Frontend Asset Structure:
```
frontend/public/
├── assets/
│   ├── images/
│   │   ├── logo.png          ← Put logo here
│   │   ├── logo-white.png    ← White version
│   │   └── favicon.ico
│   └── icons/
```

### Usage in React:
```tsx
<img src="/assets/images/logo.png" alt="BukuKas Logo" />
```

### Update Favicon:
Replace `frontend/public/vite.svg` with your logo and update `index.html`:
```html
<link rel="icon" type="image/png" href="/assets/images/favicon.ico" />
```

---

## ✅ Security Checklist

### Before Production:
- [ ] Change `BCRYPT_COST` to 12
- [ ] Generate strong JWT_SECRET (32+ chars)
- [ ] Enable rate limiting on auth endpoints
- [ ] Verify all SQL queries use parameterized statements
- [ ] Add HTTPS certificate
- [ ] Update CORS allowed origins
- [ ] Add security headers middleware
- [ ] Test SQL injection vulnerability
- [ ] Test rate limiting
- [ ] Setup database backups
- [ ] Enable logging for security events
- [ ] Add error monitoring (Sentry, etc.)

---

## 🔐 Environment Variables (Production)

```env
# Production .env
ENV=production
PORT=443

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# JWT (CRITICAL!)
JWT_SECRET=your-super-strong-random-secret-at-least-32-characters-long
JWT_EXPIRY=15m

# Bcrypt
BCRYPT_COST=12

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_LOGIN=5
RATE_LIMIT_API=100
```

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Go Security Best Practices](https://github.com/Checkmarx/Go-SCP)
- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

---

**Last Updated:** 2026-08-16
**Status:** ⚠️ Development (Security improvements needed before production)
