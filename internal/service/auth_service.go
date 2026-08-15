package service

import (
	"fmt"
	"strings"
	"time"

	"invoice-saas/internal/model"
	"invoice-saas/internal/repository"
	"invoice-saas/pkg/auth"
	"invoice-saas/pkg/validator"
)

type AuthService struct {
	userRepo *repository.UserRepository
	orgRepo  *repository.OrganizationRepository
	jwtSecret string
}

func NewAuthService(userRepo *repository.UserRepository, orgRepo *repository.OrganizationRepository, jwtSecret string) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		orgRepo:   orgRepo,
		jwtSecret: jwtSecret,
	}
}

func (s *AuthService) Register(req *model.RegisterRequest) (*model.AuthResponse, validator.ValidationErrors) {
	errors := validator.ValidationErrors{}

	// Validate inputs
	if !validator.ValidateRequired(req.Name) {
		errors.Add("name", "Name is required")
	}

	if !validator.ValidateEmail(req.Email) {
		errors.Add("email", "Invalid email address")
	}

	if !validator.ValidatePassword(req.Password) {
		errors.Add("password", "Password must be at least 8 characters")
	}

	if !validator.ValidateRequired(req.OrganizationName) {
		errors.Add("organization_name", "Organization name is required")
	}

	if errors.HasErrors() {
		return nil, errors
	}

	// Check if email already exists
	exists, err := s.userRepo.EmailExists(req.Email)
	if err != nil {
		errors.Add("email", "Failed to check email")
		return nil, errors
	}
	if exists {
		errors.Add("email", "Email already exists")
		return nil, errors
	}

	// Hash password
	passwordHash, err := auth.HashPassword(req.Password)
	if err != nil {
		errors.Add("password", "Failed to hash password")
		return nil, errors
	}

	// Create organization
	slug := generateSlug(req.OrganizationName)
	org := &model.Organization{
		Name: req.OrganizationName,
		Slug: slug,
	}
	if err := s.orgRepo.Create(org); err != nil {
		errors.Add("organization_name", "Failed to create organization")
		return nil, errors
	}

	// Create user
	user := &model.User{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: passwordHash,
	}
	if err := s.userRepo.Create(user); err != nil {
		errors.Add("email", "Failed to create user")
		return nil, errors
	}

	// Create membership
	member := &model.OrganizationMember{
		OrganizationID: org.ID,
		UserID:         user.ID,
		Role:           model.RoleOwner,
	}
	if err := s.orgRepo.CreateMember(member); err != nil {
		errors.Add("email", "Failed to create membership")
		return nil, errors
	}

	// Generate token
	token, err := auth.GenerateToken(user.ID, user.Email, org.ID, model.RoleOwner, s.jwtSecret)
	if err != nil {
		errors.Add("email", "Failed to generate token")
		return nil, errors
	}

	return &model.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) Login(req *model.LoginRequest) (*model.AuthResponse, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Check password
	if !auth.CheckPassword(req.Password, user.PasswordHash) {
		return nil, fmt.Errorf("invalid email or password")
	}

	// Get user's organization membership
	membership, err := s.orgRepo.GetUserMembership(user.ID)
	if err != nil {
		return nil, fmt.Errorf("no organization membership found")
	}

	// Generate token
	token, err := auth.GenerateToken(user.ID, user.Email, membership.OrganizationID, membership.Role, s.jwtSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token")
	}

	return &model.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) GetCurrentUser(userID int) (*model.User, error) {
	return s.userRepo.FindByID(userID)
}

func generateSlug(name string) string {
	slug := strings.ToLower(name)
	slug = strings.ReplaceAll(slug, " ", "-")
	slug = strings.ReplaceAll(slug, "_", "-")
	
	// Add timestamp to ensure uniqueness
	slug = fmt.Sprintf("%s-%d", slug, time.Now().Unix())
	
	return slug
}
