package auth

import (
	"os"
	"strconv"
	
	"golang.org/x/crypto/bcrypt"
)

// HashPassword hashes a password using bcrypt with configurable cost
// Cost 4 = ~5ms (development), Cost 10 = ~100ms, Cost 12 = ~400ms (production)
func HashPassword(password string) (string, error) {
	// Default cost (use in production)
	cost := bcrypt.DefaultCost // 10
	
	// Read cost from environment variable if set
	if envCost := os.Getenv("BCRYPT_COST"); envCost != "" {
		if c, err := strconv.Atoi(envCost); err == nil && c >= 4 && c <= 31 {
			cost = c
		}
	}
	
	hash, err := bcrypt.GenerateFromPassword([]byte(password), cost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

// CheckPassword checks if a password matches a hash
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
