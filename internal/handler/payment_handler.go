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

type PaymentHandler struct {
	service *service.PaymentService
}

func NewPaymentHandler(service *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{service: service}
}

func (h *PaymentHandler) Create(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	invoiceID, _ := strconv.Atoi(mux.Vars(r)["id"])

	var req model.CreatePaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	payment, errors := h.service.Create(claims.OrganizationID, invoiceID, &req)
	if errors != nil {
		response.ValidationError(w, errors)
		return
	}

	response.Created(w, payment)
}

func (h *PaymentHandler) GetByInvoiceID(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	invoiceID, _ := strconv.Atoi(mux.Vars(r)["id"])

	payments, err := h.service.GetByInvoiceID(invoiceID, claims.OrganizationID)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.Success(w, payments)
}
