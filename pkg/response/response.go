package response

import (
	"encoding/json"
	"net/http"
)

// SuccessResponse represents a successful API response
type SuccessResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessResponseWithPagination represents a successful API response with pagination
type SuccessResponseWithPagination struct {
	Success    bool        `json:"success"`
	Data       interface{} `json:"data"`
	Pagination interface{} `json:"pagination"`
}

// ErrorResponse represents an error API response
type ErrorResponse struct {
	Success bool       `json:"success"`
	Error   ErrorDetail `json:"error"`
}

// ErrorDetail contains error details
type ErrorDetail struct {
	Code    string                 `json:"code"`
	Message string                 `json:"message"`
	Fields  map[string]string      `json:"fields,omitempty"`
}

// JSON sends a JSON response
func JSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(data)
}

// Success sends a successful response
func Success(w http.ResponseWriter, data interface{}) {
	JSON(w, http.StatusOK, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

// SuccessWithPagination sends a successful response with pagination
func SuccessWithPagination(w http.ResponseWriter, data interface{}, pagination interface{}) {
	JSON(w, http.StatusOK, SuccessResponseWithPagination{
		Success:    true,
		Data:       data,
		Pagination: pagination,
	})
}

// Created sends a created response
func Created(w http.ResponseWriter, data interface{}) {
	JSON(w, http.StatusCreated, SuccessResponse{
		Success: true,
		Data:    data,
	})
}

// Error sends an error response
func Error(w http.ResponseWriter, statusCode int, code, message string) {
	JSON(w, statusCode, ErrorResponse{
		Success: false,
		Error: ErrorDetail{
			Code:    code,
			Message: message,
		},
	})
}

// ValidationError sends a validation error response
func ValidationError(w http.ResponseWriter, fields map[string]string) {
	JSON(w, http.StatusBadRequest, ErrorResponse{
		Success: false,
		Error: ErrorDetail{
			Code:    "VALIDATION_ERROR",
			Message: "Invalid request",
			Fields:  fields,
		},
	})
}

// BadRequest sends a bad request error
func BadRequest(w http.ResponseWriter, message string) {
	Error(w, http.StatusBadRequest, "BAD_REQUEST", message)
}

// Unauthorized sends an unauthorized error
func Unauthorized(w http.ResponseWriter, message string) {
	Error(w, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

// Forbidden sends a forbidden error
func Forbidden(w http.ResponseWriter, message string) {
	Error(w, http.StatusForbidden, "FORBIDDEN", message)
}

// NotFound sends a not found error
func NotFound(w http.ResponseWriter, message string) {
	Error(w, http.StatusNotFound, "NOT_FOUND", message)
}

// InternalError sends an internal server error
func InternalError(w http.ResponseWriter, message string) {
	Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}
