package repository

import (
	"database/sql"
	"fmt"

	"invoice-saas/internal/model"
)

type OrganizationRepository struct {
	db *sql.DB
}

func NewOrganizationRepository(db *sql.DB) *OrganizationRepository {
	return &OrganizationRepository{db: db}
}

func (r *OrganizationRepository) Create(org *model.Organization) error {
	query := `
		INSERT INTO organizations (name, slug, email, phone, address, logo_url)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(query, org.Name, org.Slug, org.Email, org.Phone, org.Address, org.LogoURL).
		Scan(&org.ID, &org.CreatedAt, &org.UpdatedAt)
}

func (r *OrganizationRepository) FindByID(id int) (*model.Organization, error) {
	org := &model.Organization{}
	query := `
		SELECT id, name, slug, email, phone, address, logo_url, created_at, updated_at
		FROM organizations
		WHERE id = $1
	`
	err := r.db.QueryRow(query, id).Scan(
		&org.ID, &org.Name, &org.Slug, &org.Email, &org.Phone,
		&org.Address, &org.LogoURL, &org.CreatedAt, &org.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("organization not found")
	}
	if err != nil {
		return nil, err
	}
	return org, nil
}

func (r *OrganizationRepository) CreateMember(member *model.OrganizationMember) error {
	query := `
		INSERT INTO organization_members (organization_id, user_id, role)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	return r.db.QueryRow(query, member.OrganizationID, member.UserID, member.Role).
		Scan(&member.ID, &member.CreatedAt)
}

func (r *OrganizationRepository) GetUserMembership(userID int) (*model.OrganizationMember, error) {
	member := &model.OrganizationMember{}
	query := `
		SELECT id, organization_id, user_id, role, created_at
		FROM organization_members
		WHERE user_id = $1
		LIMIT 1
	`
	err := r.db.QueryRow(query, userID).Scan(
		&member.ID, &member.OrganizationID, &member.UserID, &member.Role, &member.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("membership not found")
	}
	if err != nil {
		return nil, err
	}
	return member, nil
}
