# Deployment Guide - Invoice SaaS

This guide covers deploying the Invoice SaaS application to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Database Setup](#database-setup)
6. [Security Checklist](#security-checklist)
7. [Monitoring](#monitoring)
8. [Backup Strategy](#backup-strategy)

## Prerequisites

- Server with Docker and Docker Compose
- PostgreSQL database (local or cloud)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Environment Configuration

### Production .env File

Create a `.env` file with production values:

```bash
# Application
APP_ENV=production
APP_PORT=8080

# Database (use managed database service recommended)
DATABASE_URL=postgres://username:password@host:5432/invoice_saas?sslmode=require

# JWT Secret (generate a strong random string)
JWT_SECRET=<generate-strong-secret-here>

# CORS (set to your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### Generate Strong JWT Secret

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 3: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Docker Deployment

### Option 1: Docker Compose (Simple)

1. **Prepare the server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y
```

2. **Clone and configure**
```bash
git clone <your-repo-url> invoice-saas
cd invoice-saas

# Copy and edit environment file
cp .env.example .env
nano .env  # Edit with production values
```

3. **Deploy**
```bash
# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Check status
docker-compose ps
```

4. **Setup SSL with Nginx (Recommended)**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: invoice_saas_db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: invoice_saas
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: always
    networks:
      - invoice_network

  api:
    build: .
    container_name: invoice_saas_api
    environment:
      APP_ENV: production
      APP_PORT: 8080
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      CORS_ORIGIN: ${CORS_ORIGIN}
      LOG_LEVEL: info
    depends_on:
      - postgres
    restart: always
    networks:
      - invoice_network

  nginx:
    image: nginx:alpine
    container_name: invoice_saas_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: always
    networks:
      - invoice_network

volumes:
  postgres_data:

networks:
  invoice_network:
    driver: bridge
```

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server api:8080;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location /api {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            # Serve frontend here
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

## Cloud Deployment

### AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Build and push Docker image**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t invoice-saas .

# Tag image
docker tag invoice-saas:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/invoice-saas:latest

# Push image
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/invoice-saas:latest
```

2. **Setup RDS PostgreSQL**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier invoice-saas-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <password> \
  --allocated-storage 20
```

3. **Create ECS Task Definition**

`task-definition.json`:
```json
{
  "family": "invoice-saas",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "invoice-saas-api",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/invoice-saas:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "APP_ENV",
          "value": "production"
        },
        {
          "name": "APP_PORT",
          "value": "8080"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account-id:secret:jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/invoice-saas",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "api"
        }
      }
    }
  ]
}
```

### Google Cloud Platform (GCP)

#### Using Cloud Run

1. **Build and deploy**
```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/invoice-saas

# Deploy to Cloud Run
gcloud run deploy invoice-saas \
  --image gcr.io/YOUR_PROJECT_ID/invoice-saas \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars APP_ENV=production,APP_PORT=8080 \
  --set-secrets DATABASE_URL=database-url:latest,JWT_SECRET=jwt-secret:latest
```

2. **Setup Cloud SQL (PostgreSQL)**
```bash
gcloud sql instances create invoice-saas-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Digital Ocean

#### Using App Platform

1. **Create `app.yaml`**
```yaml
name: invoice-saas
services:
  - name: api
    github:
      repo: your-username/invoice-saas
      branch: main
    dockerfile_path: Dockerfile
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: APP_ENV
        value: "production"
      - key: APP_PORT
        value: "8080"
      - key: DATABASE_URL
        type: SECRET
      - key: JWT_SECRET
        type: SECRET
      - key: CORS_ORIGIN
        value: "https://yourdomain.com"

databases:
  - name: invoice-saas-db
    engine: PG
    version: "14"
    production: true
```

2. **Deploy**
```bash
doctl apps create --spec app.yaml
```

## Database Setup

### Managed Database Services (Recommended)

#### AWS RDS
- Automatic backups
- Point-in-time recovery
- Multi-AZ deployment for high availability
- Automatic failover

#### Google Cloud SQL
- Automatic replication
- Automated backups
- High availability configuration

#### Digital Ocean Managed Database
- Automatic daily backups
- Point-in-time recovery
- Standby nodes for high availability

### Database Migration on Deploy

The application automatically runs migrations on startup. Ensure:

1. Migration files are included in the Docker image
2. Database user has CREATE TABLE permissions
3. Network connectivity between app and database

## Security Checklist

### Before Going Live

- [ ] Generate strong JWT secret (32+ characters)
- [ ] Use HTTPS/SSL certificate
- [ ] Set secure database password
- [ ] Enable SSL for database connections (`sslmode=require`)
- [ ] Configure CORS to specific domain (not `*`)
- [ ] Set `APP_ENV=production`
- [ ] Remove default/demo accounts
- [ ] Enable database encryption at rest
- [ ] Setup firewall rules (allow only necessary ports)
- [ ] Enable rate limiting (nginx, API gateway)
- [ ] Setup monitoring and alerts
- [ ] Configure automated backups
- [ ] Document recovery procedures
- [ ] Setup log aggregation
- [ ] Enable audit logging

### Environment Variables Security

Never commit these to git:
- `JWT_SECRET`
- `DATABASE_URL`
- Any API keys
- Production credentials

Use secret management:
- AWS Secrets Manager
- Google Secret Manager
- HashiCorp Vault
- Environment variables in hosting platform

## Monitoring

### Application Monitoring

1. **Setup Prometheus**

Add to `docker-compose.yml`:
```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3000:3000"
  depends_on:
    - prometheus
```

2. **Setup Health Check Endpoint**

Add to your API:
```go
router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
})
```

3. **Log Aggregation**

Use ELK Stack (Elasticsearch, Logstash, Kibana) or managed service:
- AWS CloudWatch
- Google Cloud Logging
- DataDog
- New Relic

## Backup Strategy

### Automated Database Backups

#### Using pg_dump (Cron Job)

Create `backup.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="invoice_saas_$DATE.sql"

# Backup
pg_dump $DATABASE_URL > $BACKUP_DIR/$FILENAME

# Compress
gzip $BACKUP_DIR/$FILENAME

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/$FILENAME.gz s3://your-bucket/backups/
```

Setup cron:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

#### Managed Database Automatic Backups

Most cloud providers offer:
- Daily automated backups
- Point-in-time recovery
- Backup retention (7-35 days)
- Cross-region replication

## Performance Optimization

### Database Connection Pooling

Update `pkg/database/database.go`:
```go
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(25)
db.SetConnMaxLifetime(5 * time.Minute)
```

### Caching

Add Redis for caching:
```yaml
redis:
  image: redis:alpine
  ports:
    - "6379:6379"
```

### CDN for Static Assets

Use:
- AWS CloudFront
- Cloudflare
- Google Cloud CDN

## Scaling

### Horizontal Scaling

1. **Add more API instances**
```bash
docker-compose up -d --scale api=3
```

2. **Load Balancer**
Use nginx or cloud load balancer:
- AWS Application Load Balancer
- Google Cloud Load Balancing
- Cloudflare Load Balancing

### Database Scaling

- Read replicas for read-heavy workloads
- Vertical scaling (increase instance size)
- Connection pooling
- Query optimization

## Troubleshooting

### Check Application Logs
```bash
docker-compose logs -f api
```

### Check Database Connection
```bash
docker-compose exec api sh
psql $DATABASE_URL
```

### Restart Services
```bash
docker-compose restart api
```

### Check Resource Usage
```bash
docker stats
```

## Post-Deployment Checklist

- [ ] Application is accessible via HTTPS
- [ ] Database migrations completed successfully
- [ ] Can register new user
- [ ] Can login
- [ ] Can create customers, products, invoices
- [ ] Multi-tenancy working (users can't see other org data)
- [ ] CORS configured correctly
- [ ] Monitoring alerts configured
- [ ] Backup tested and working
- [ ] Recovery procedure documented
- [ ] Team trained on operations

## Rollback Procedure

If deployment fails:

1. **Quick rollback**
```bash
docker-compose down
git checkout previous-commit
docker-compose up -d
```

2. **Database rollback**
```bash
psql $DATABASE_URL < backup_file.sql
```

3. **Check application health**
```bash
curl https://yourdomain.com/health
```

## Support and Maintenance

### Regular Maintenance Tasks

- Weekly: Review logs and error rates
- Monthly: Update dependencies and security patches
- Quarterly: Review and optimize database performance
- Yearly: Disaster recovery drill

### Updates and Patches

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f api
```

## Conclusion

Your Invoice SaaS application is now deployed and ready for production use. Monitor the application regularly and follow the maintenance schedule to ensure optimal performance and security.
