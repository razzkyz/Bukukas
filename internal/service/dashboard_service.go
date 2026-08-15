package service

import (
	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
)

type DashboardService struct {
	invoiceRepo  *repository.InvoiceRepository
	customerRepo *repository.CustomerRepository
}

func NewDashboardService(invoiceRepo *repository.InvoiceRepository, customerRepo *repository.CustomerRepository) *DashboardService {
	return &DashboardService{
		invoiceRepo:  invoiceRepo,
		customerRepo: customerRepo,
	}
}

func (s *DashboardService) GetStats(organizationID int) (*model.DashboardStats, error) {
	stats, err := s.invoiceRepo.GetDashboardStats(organizationID)
	if err != nil {
		return nil, err
	}

	customerCount, err := s.customerRepo.Count(organizationID)
	if err != nil {
		return nil, err
	}

	stats.TotalCustomers = customerCount

	return stats, nil
}

func (s *DashboardService) GetRevenueChart(organizationID int, days int) ([]model.RevenueChartData, error) {
	if days <= 0 {
		days = 7
	}
	return s.invoiceRepo.GetRevenueChart(organizationID, days)
}
