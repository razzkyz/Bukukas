package service

import (
	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
	"invoice-saas/pkg/validator"
)

type CustomerService struct {
	repo *repository.CustomerRepository
}

func NewCustomerService(repo *repository.CustomerRepository) *CustomerService {
	return &CustomerService{repo: repo}
}

func (s *CustomerService) Create(organizationID int, req *model.CreateCustomerRequest) (*model.Customer, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	if !validator.ValidateRequired(req.Name) {
		errors.Add("name", "Name is required")
	}

	if req.Email != "" && !validator.ValidateEmail(req.Email) {
		errors.Add("email", "Invalid email address")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	customer := &model.Customer{
		OrganizationID: organizationID,
		Name:           req.Name,
		Email:          req.Email,
		Phone:          req.Phone,
		Address:        req.Address,
	}

	if err := s.repo.Create(customer); err != nil {
		errors.Add("name", "Failed to create customer")
		return nil, errors
	}

	return customer, nil
}

func (s *CustomerService) Update(id, organizationID int, req *model.UpdateCustomerRequest) (*model.Customer, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	if !validator.ValidateRequired(req.Name) {
		errors.Add("name", "Name is required")
	}

	if req.Email != "" && !validator.ValidateEmail(req.Email) {
		errors.Add("email", "Invalid email address")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	customer := &model.Customer{
		ID:             id,
		OrganizationID: organizationID,
		Name:           req.Name,
		Email:          req.Email,
		Phone:          req.Phone,
		Address:        req.Address,
	}

	if err := s.repo.Update(customer); err != nil {
		errors.Add("name", "Failed to update customer")
		return nil, errors
	}

	updated, err := s.repo.FindByID(id, organizationID)
	if err != nil {
		errors.Add("customer", "Failed to retrieve updated customer")
		return nil, errors
	}

	return updated, nil
}

func (s *CustomerService) Delete(id, organizationID int) error {
	return s.repo.Delete(id, organizationID)
}

func (s *CustomerService) GetByID(id, organizationID int) (*model.Customer, error) {
	return s.repo.FindByID(id, organizationID)
}

func (s *CustomerService) List(organizationID int, search string, page, limit int) ([]model.Customer, *model.PaginationResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	customers, total, err := s.repo.List(organizationID, search, page, limit)
	if err != nil {
		return nil, nil, err
	}

	totalPages := (total + limit - 1) / limit

	pagination := &model.PaginationResponse{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: totalPages,
	}

	return customers, pagination, nil
}
