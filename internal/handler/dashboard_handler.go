package handler

import (
	"net/http"
	"strconv"

	"invoice-saas/internal/middleware"
	"invoice-saas/internal/service"
	"invoice-saas/pkg/response"
)

type DashboardHandler struct {
	service *service.DashboardService
}

func NewDashboardHandler(service *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{service: service}
}

func (h *DashboardHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)

	stats, err := h.service.GetStats(claims.OrganizationID)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.Success(w, stats)
}

func (h *DashboardHandler) GetRevenueChart(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserFromContext(r)
	days, _ := strconv.Atoi(r.URL.Query().Get("days"))

	if days == 0 {
		days = 7
	}

	data, err := h.service.GetRevenueChart(claims.OrganizationID, days)
	if err != nil {
		response.InternalError(w, err.Error())
		return
	}

	response.Success(w, data)
}
