package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Claims represents JWT claims
type Claims struct {
	UserID         int    `json:"user_id"`
	Email          string `json:"email"`
	OrganizationID int    `json:"organization_id"`
	Role           string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token for a user
// Production: Token expires in 24 hours for better security
func GenerateToken(userID int, email string, organizationID int, role string, jwtSecret string) (string, error) {
	// Token expiry: 24 hours (can be made shorter in production)
	expiryTime := 24 * time.Hour
	
	claims := Claims{
		UserID:         userID,
		Email:          email,
		OrganizationID: organizationID,
		Role:           role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expiryTime)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "bukukas-api",
			Subject:   email,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

// ValidateToken validates and parses a JWT token with strict checks
func ValidateToken(tokenString string, jwtSecret string) (*Claims, error) {
	// Parse token with strict validation
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method to prevent algorithm confusion attacks
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, fmt.Errorf("token parsing failed: %w", err)
	}

	// Validate claims
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		// Additional validation: Check if token is expired
		if claims.ExpiresAt != nil && claims.ExpiresAt.Before(time.Now()) {
			return nil, fmt.Errorf("token has expired")
		}
		
		// Additional validation: Check if token is used before valid time
		if claims.NotBefore != nil && claims.NotBefore.After(time.Now()) {
			return nil, fmt.Errorf("token not valid yet")
		}
		
		// Additional validation: Check issuer
		if claims.Issuer != "bukukas-api" {
			return nil, fmt.Errorf("invalid token issuer")
		}
		
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}
