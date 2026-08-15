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

type InvoiceHandler struct {
	service *service.InvoiceService
}

func NewInvoiceHandler(service *service.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{service: service}
}

func (h *InvoiceHandler) Create(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	var req model.CreateInvoiceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	invoice, errors := h.service.Create(claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Created(w, invoice)
}

func (h *InvoiceHandler) Update(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var req model.UpdateInvoiceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	invoice, errors := h.service.Update(id, claims.OrganizationID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Success(w, invoice)
}

func (h *InvoiceHandler) Delete(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if err := h.service.Delete(id, claims.OrganizationID); err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "Invoice deleted successfully"})
}

func (h *InvoiceHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	invoice, err := h.service.GetByID(id, claims.OrganizationID)
	if err != nil {
		response.NotFound(w, err.Error())
		return
	}

	response.Success(w, invoice)
}

func (h *InvoiceHandler) List(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	status := r.URL.Query().Get("status")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	invoices, pagination, err := h.service.List(claims.OrganizationID, status, page, limit)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.SuccessWithPagination(w, invoices, pagination)
}

func (h *InvoiceHandler) Send(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if err := h.service.SendInvoice(id, claims.OrganizationID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "Invoice sent successfully"})
}

func (h *InvoiceHandler) Cancel(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if err := h.service.CancelInvoice(id, claims.OrganizationID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, map[string]string{"message": "Invoice cancelled successfully"})
}
