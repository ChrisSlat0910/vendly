# Vendly — Community-Based Marketplace API

> A production-grade REST API backend for a community-driven marketplace platform, built with Spring Boot 4.x and Java 21.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## Overview

Vendly is a marketplace REST API that supports community-scoped listings, seller stores, buyer-seller transactions, disputes, and a trust & safety system. The project demonstrates a modular Spring Boot 4.x architecture with clean separation of concerns, Flyway-managed database migrations, and JWT-based stateless authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 (LTS) |
| Framework | Spring Boot 4.0.5 |
| Security | Spring Security 7.x, JWT (JJWT 0.12.3) |
| ORM | Hibernate 7.2 / Spring Data JPA |
| Database | PostgreSQL 17 |
| Cache / Session | Redis 7 |
| Migration | Flyway 11.x |
| AOP | Spring AspectJ (spring-boot-starter-aspectj) |
| Containerization | Docker + Docker Compose |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build | Maven 3.9 (Maven Wrapper) |

---

## Architecture

```
vendly/
├── backend/                  ← Spring Boot 4.x (this service)
│   ├── src/main/java/com/vendly/backend/
│   │   ├── admin/            ← Admin role management
│   │   ├── auth/             ← JWT auth, OTP, password reset
│   │   ├── common/           ← Filters, exceptions, AOP, config
│   │   └── user/             ← User profile
│   └── src/main/resources/
│       ├── db/migration/     ← Flyway migrations (V1–V19)
│       └── application.yaml
├── frontend/                 ← Next.js (WIP)
├── realtime/                 ← Go WebSocket service (WIP)
├── nginx/                    ← Reverse proxy config
└── docker-compose.yml
```

### Request Flow

```
Client → Nginx → Spring Boot
                    ├── CorrelationIdFilter   (request tracing)
                    ├── RateLimitFilter       (Redis-based rate limiting)
                    ├── JwtAuthFilter         (stateless auth)
                    └── Controller → Service → Repository → PostgreSQL
```

---

## Implemented Features

### Authentication & Security
- User registration with email OTP verification
- Login with JWT access token (15 min) + httpOnly refresh token cookie (7 days)
- Token refresh endpoint
- Logout with refresh token revocation
- Account lockout after 5 failed login attempts (15 min lockout)
- Forgot password / reset password with time-limited tokens (15 min)
- BCrypt password hashing

### Authorization
- Role-based access control via `admin_roles` table
- Custom `@RequireAdmin` annotation powered by Spring AOP aspect
- Admin endpoints: grant/revoke admin, check admin status

### Infrastructure
- **Flyway migrations** — 19 versioned SQL migrations (V1–V19)
- **Soft delete** — `deleted_at` column + `@SQLRestriction` on JPA entities
- **Rate limiting** — Redis-backed per-IP rate limiting via custom filter
- **Correlation ID** — every request gets a unique trace ID in response headers
- **Docker Compose** — single command to run postgres + redis + backend

---

## Database Schema

19 Flyway migrations covering:

| Migration | Tables Created |
|---|---|
| V1–V2 | `users`, `user_tokens`, `admin_roles` |
| V3 | `credit_score_history`, `bans` |
| V4 | `file_uploads` |
| V5 | `tags`, `entity_tags` |
| V6 | `communities`, `channels`, `messages` |
| V7 | `listings`, `listing_images` |
| V8 | `transactions`, `offers`, `price_requests`, `private_messages` |
| V9 | `disputes`, `dispute_messages`, `dispute_evidences` |
| V10–V11 | `notifications`, `email_logs` |
| V12 | `stores`, `store_policies`, `store_followers` |
| V13 | Seed data (admin + demo users) |
| V14 | `password_resets` |
| V15 | `seller_reviews` |
| V16 | `reports` |
| V17–V19 | Soft delete columns + indexes |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register new user |
| POST | `/verify-email` | ❌ | Verify email with OTP |
| POST | `/resend-otp` | ❌ | Resend OTP |
| POST | `/login` | ❌ | Login, returns JWT + sets refresh cookie |
| POST | `/refresh` | 🍪 Cookie | Refresh access token |
| POST | `/logout` | 🍪 Cookie | Revoke refresh token |
| POST | `/forgot-password` | ❌ | Request password reset token |
| GET | `/validate-reset-token` | ❌ | Validate reset token |
| POST | `/reset-password` | ❌ | Reset password with token |

### Admin — `/api/v1/admin` *(requires admin JWT)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/{id}/grant-admin` | Grant admin role to user |
| DELETE | `/users/{id}/revoke-admin` | Revoke admin role from user |
| GET | `/users/{id}/is-admin` | Check if user is admin |

### Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/{id}/profile` | ❌ | Get public user profile |

---

## Getting Started

### Prerequisites

- Docker Desktop 4.x
- Git

### Setup

```bash
# 1. Clone repository
git clone https://github.com/ChrisSlat0910/vendly.git
cd vendly

# 2. Copy environment file
cp .env.example .env
# Edit .env if needed (defaults work for local development)

# 3. Start all services
docker compose up postgres redis backend

# 4. Verify backend is running
curl http://localhost:8080/actuator/health
# → {"status":"UP"}
```

### Environment Variables

```env
DATABASE_URL=jdbc:postgresql://postgres:5432/vendly
POSTGRES_DB=vendly
POSTGRES_USER=vendly_user
POSTGRES_PASSWORD=vendly123
JWT_SECRET=<your-base64-secret>
JWT_ACCESS_TOKEN_EXPIRY_MS=900000
JWT_REFRESH_TOKEN_EXPIRY_MS=604800000
APP_FRONTEND_URL=http://localhost:3000
```

### Seed Accounts

After startup, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@vendly.id` | `Test1234` |
| Seller | `seller@vendly.id` | `Test1234` |
| Buyer | `buyer@vendly.id` | `Test1234` |

### Quick API Test

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test1234","displayName":"Test User"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@vendly.id","password":"Test1234"}'
```

---

## API Documentation

Swagger UI is available at:

```
http://localhost:8080/swagger-ui.html
```

---

## Key Design Decisions

**Spring Boot 4.x on Java 21** — Uses the latest Spring Boot generation requiring `spring-boot-starter-aspectj` (renamed from `spring-boot-starter-aop` in 4.0).

**Stateless JWT Auth** — Access tokens stored in JS memory (short-lived), refresh tokens in httpOnly cookies scoped to `/api/v1/auth`. No server-side session.

**Flyway over Hibernate DDL** — All schema changes are versioned SQL migrations, never `hibernate.ddl-auto=update`. Ensures reproducible environments.

**Soft Delete via @SQLRestriction** — Deleted records are filtered at the ORM level using `@SQLRestriction("deleted_at IS NULL")`, transparent to all queries.

**AOP Admin Guard** — `@RequireAdmin` annotation intercepted by `AdminAspect` — no boilerplate security checks in controllers.

---

## WIP / Roadmap

- [ ] Listing CRUD (create, edit, publish, delete)
- [ ] File upload (listing images)
- [ ] Transaction flow (buy request → payment → confirmation)
- [ ] Offer / price negotiation
- [ ] Seller store profile
- [ ] Community channels & messaging
- [ ] Email notifications (Gmail SMTP)
- [ ] Frontend — Next.js
- [ ] Realtime — Go WebSocket service
- [ ] CI/CD pipeline

---

## Project Status

> **Active development** — Backend auth system complete, working toward full marketplace MVP.

---

## Author

**Chris** — Master's student in Teknik Informatika, Universitas Hasanuddin  
Full Stack Developer · Backend Engineer

---

*Built with Spring Boot 4.x, PostgreSQL, Redis, Docker*
