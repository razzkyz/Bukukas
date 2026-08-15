package validator

import (
	"regexp"
	"strings"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// ValidateEmail validates an email address
func ValidateEmail(email string) bool {
	return emailRegex.MatchString(email)
}

// ValidateRequired validates that a string is not empty
func ValidateRequired(value string) bool {
	return strings.TrimSpace(value) != ""
}

// ValidateMinLength validates minimum string length
func ValidateMinLength(value string, minLength int) bool {
	return len(strings.TrimSpace(value)) >= minLength
}

// ValidatePassword validates password requirements
func ValidatePassword(password string) bool {
	return len(password) >= 8
}

// ValidationErrors holds validation errors
type ValidationErrors map[string]string

// Add adds a validation error
func (v ValidationErrors) Add(field, message string) {
	v[field] = message
}

// HasErrors returns true if there are validation errors
func (v ValidationErrors) HasErrors() bool {
	return len(v) > 0
}
