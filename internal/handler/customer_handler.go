package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"invoice-saas/internal/middleware"
	"invoice-saas/internal/model"
	"invoice-saas/internal/service"
	"invoice-saas/pkg/response"
)

type CustomerHandler struct {
	service *service.CustomerService
}

func NewCustomerHandler(service *service.CustomerService) *CustomerHandler {
	return &CustomerHandler{service: service}
}

func (h *CustomerHandler) Create(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	var req model.CreateCustomerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	customer, errors := h.service.Create(claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Created(w, customer)
}

func (h *CustomerHandler) Update(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid customer ID")
		return
	}

	var req model.UpdateCustomerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	customer, errors := h.service.Update(id, claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Success(w, customer)
}

func (h *CustomerHandler) Delete(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid customer ID")
		return
	}

	if err := h.service.Delete(id, claims.OrganizationID); err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "Customer deleted successfully"})
}

func (h *CustomerHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		response.BadRequest(w, "Invalid customer ID")
		return
	}

	customer, err := h.service.GetByID(id, claims.OrganizationID)
	if err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, customer)
}

func (h *CustomerHandler) List(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	if claims == nil {
		response.Unauthorized(w, "Unauthorized")
		return
	}

	// Get query parameters
	search := r.URL.Query().Get("search")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	customers, pagination, err := h.service.List(claims.OrganizationID, search, page, limit)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.SuccessWithPagination(w, customers, pagination)
}
