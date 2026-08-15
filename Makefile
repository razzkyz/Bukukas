.PHONY: help build run test clean docker-up docker-down docker-logs migrate db-create db-drop db-reset

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	@echo "Building application..."
	go build -o bin/server cmd/server/main.go

run: ## Run the application
	@echo "Running application..."
	go run cmd/server/main.go

test: ## Run tests
	@echo "Running tests..."
	go test -v ./...

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf bin/

docker-up: ## Start Docker containers
	@echo "Starting Docker containers..."
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "Stopping Docker containers..."
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f api

docker-build: ## Build Docker image
	@echo "Building Docker image..."
	docker-compose build

docker-restart: ## Restart Docker containers
	@echo "Restarting Docker containers..."
	docker-compose restart

db-create: ## Create database
	@echo "Creating database..."
	createdb invoice_saas

db-drop: ## Drop database
	@echo "Dropping database..."
	dropdb invoice_saas

db-reset: db-drop db-create ## Reset database
	@echo "Database reset complete"

migrate: ## Run migrations
	@echo "Migrations are run automatically on startup"

deps: ## Download dependencies
	@echo "Downloading dependencies..."
	go mod download

tidy: ## Tidy go.mod
	@echo "Tidying go.mod..."
	go mod tidy

dev: ## Run with hot reload (requires air)
	@echo "Starting development server with hot reload..."
	air

install-air: ## Install air for hot reloading
	@echo "Installing air..."
	go install github.com/cosmtrek/air@latest

format: ## Format code
	@echo "Formatting code..."
	go fmt ./...

lint: ## Run linter (requires golangci-lint)
	@echo "Running linter..."
	golangci-lint run

install-lint: ## Install golangci-lint
	@echo "Installing golangci-lint..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
