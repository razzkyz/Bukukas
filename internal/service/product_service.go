package service

import (
	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
	"invoice-saas/pkg/validator"
)

type ProductService struct {
	repo *repository.ProductRepository
}

func NewProductService(repo *repository.ProductRepository) *ProductService {
	return &ProductService{repo: repo}
}

func (s *ProductService) Create(organizationID int, req *model.CreateProductRequest) (*model.Product, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	if !validator.ValidateRequired(req.Name) {
		errors.Add("name", "Name is required")
	}

	if req.Price <= 0 {
		errors.Add("price", "Price must be greater than zero")
	}

	if !validator.ValidateRequired(req.Unit) {
		errors.Add("unit", "Unit is required")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	product := &model.Product{
		OrganizationID: organizationID,
		Name:           req.Name,
		Description:    req.Description,
		Price:          req.Price,
		Unit:           req.Unit,
	}

	if err := s.repo.Create(product); err != nil {
		errors.Add("name", "Failed to create product")
		return nil, errors
	}

	return product, nil
}

func (s *ProductService) Update(id, organizationID int, req *model.UpdateProductRequest) (*model.Product, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	if !validator.ValidateRequired(req.Name) {
		errors.Add("name", "Name is required")
	}

	if req.Price <= 0 {
		errors.Add("price", "Price must be greater than zero")
	}

	if !validator.ValidateRequired(req.Unit) {
		errors.Add("unit", "Unit is required")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	product := &model.Product{
		ID:             id,
		OrganizationID: organizationID,
		Name:           req.Name,
		Description:    req.Description,
		Price:          req.Price,
		Unit:           req.Unit,
	}

	if err := s.repo.Update(product); err != nil {
		errors.Add("name", "Failed to update product")
		return nil, errors
	}

	updated, err := s.repo.FindByID(id, organizationID)
	if err != nil {
		errors.Add("product", "Failed to retrieve updated product")
		return nil, errors
	}

	return updated, nil
}

func (s *ProductService) Delete(id, organizationID int) error {
	return s.repo.Delete(id, organizationID)
}

func (s *ProductService) GetByID(id, organizationID int) (*model.Product, error) {
	return s.repo.FindByID(id, organizationID)
}

func (s *ProductService) List(organizationID int, search string, page, limit int) ([]model.Product, *model.PaginationResponse, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	products, total, err := s.repo.List(organizationID, search, page, limit)
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

	return products, pagination, nil
}
