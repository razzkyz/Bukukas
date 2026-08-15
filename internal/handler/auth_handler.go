package handler

import (
	"encoding/json"
	"net/http"

	"invoice-saas/internal/middleware"
	"invoice-saas/internal/model"
	"invoice-saas/internal/service"
	"invoice-saas/pkg/response"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req model.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	authResp, errors := h.service.Register(&req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Created(w, authResp)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	authResp, err := h.service.Login(&req)
	if err != nil {
		response.Unauthorized(w, err.Error())
		return
	}

	response.Success(w, authResp)
}

func (h *AuthHandler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	user, err := h.service.GetCurrentUser(claims.UserID)
	if err != nil {
		response.NotFound(w, "User not found")
		return
	}

	response.Success(w, user)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	// JWT is stateless, so logout is handled on the client side
	response.Success(w, map[string]string{"message": "Logged out successfully"})
}
