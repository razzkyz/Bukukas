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

type ProductHandler struct {
	service *service.ProductService
}

func NewProductHandler(service *service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	var req model.CreateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	product, errors := h.service.Create(claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Created(w, product)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var req model.UpdateProductRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	product, errors := h.service.Update(id, claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Success(w, product)
}

func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if err := h.service.Delete(id, claims.OrganizationID); err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "Product deleted successfully"})
}

func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	product, err := h.service.GetByID(id, claims.OrganizationID)
	if err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, product)
}

func (h *ProductHandler) List(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	search := r.URL.Query().Get("search")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	products, pagination, err := h.service.List(claims.OrganizationID, search, page, limit)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.SuccessWithPagination(w, products, pagination)
}
