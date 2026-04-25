# Vendly — Community-Based Marketplace

> A production-grade full-stack marketplace platform built with Spring Boot 4.x, Next.js, PostgreSQL, and Redis.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## Overview

Vendly is a community-based marketplace web application where users can buy, sell, and trade items within trusted communities. The project demonstrates a production-grade full-stack architecture with security hardening and modern development practices.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language (Backend) | Java 21 (LTS) |
| Framework | Spring Boot 4.0.5 |
| Security | Spring Security 7.x, JWT |
| ORM | Hibernate 7.2 / Spring Data JPA |
| Database | PostgreSQL 17 |
| Cache / Rate Limiting | Redis 7 |
| Migration | Flyway 11.x |
| AOP | Spring AspectJ |
| Language (Frontend) | TypeScript 5 |
| Framework (Frontend) | Next.js 15 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| HTTP Client | Axios with interceptors |
| Animation | Framer Motion |
| Charts | Recharts |
| Containerization | Docker + Docker Compose |

---

## Implemented Features

### Backend

- User registration with email OTP verification
- Login with JWT access token + httpOnly refresh token cookie
- Token refresh with automatic rotation
- Account lockout after failed attempts
- Forgot/reset password flow
- Role-based access control via `@RequireAdmin` AOP annotation
- Listing CRUD with full-text search, pagination, soft delete
- Admin endpoints — manage users and listings
- Redis rate limiting per IP
- Correlation ID request tracing
- Flyway versioned migrations (V1–V20)

### Frontend

- Landing page with category grid and trending section
- Browse listing — search, condition filter, COD/NEGO badges
- Listing detail — seller info, owner actions
- Create/Edit listing with live preview
- Dashboard — profile card, stats, performance chart, inbox
- Admin panel — user management, listing management
- Auth with persistent session via refresh token cookie
- Dark/light theme toggle
- Responsive design

---

## Database Schema

20 Flyway migrations covering users, auth, listings, transactions, disputes, communities, stores, notifications, reviews, reports, and seed data.

---

## API Endpoints

### Auth `/api/v1/auth`
`POST /register` · `POST /login` · `POST /refresh` · `POST /logout` · `POST /forgot-password` · `POST /reset-password`

### Listings `/api/v1/listings`
`GET /` · `GET /{id}` · `GET /my` · `POST /` · `PUT /{id}` · `DELETE /{id}`

### Users `/api/v1/users`
`GET /me` · `GET /{id}/profile`

### Admin `/api/v1/admin` *(ADMIN only)*
`GET /users` · `POST /users/{id}/grant-admin` · `DELETE /users/{id}/revoke-admin` · `GET /listings` · `DELETE /listings/{id}`

---

## Getting Started

### Prerequisites
- Docker Desktop 4.x
- Node.js 20+

### Setup

```bash
# Clone
git clone https://github.com/ChrisSlat0910/vendly.git
cd vendly

# Start backend
docker compose up postgres redis backend

# Start frontend
cd frontend
npm install
npm run dev
```

### Seed Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@vendly.id` | `Test1234` |
| Seller | `seller@vendly.id` | `Test1234` |
| Buyer | `buyer@vendly.id` | `Test1234` |

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
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## Key Design Decisions

- **Stateless JWT** — Access tokens in JS memory, refresh tokens in httpOnly cookies
- **Flyway over Hibernate DDL** — All schema changes versioned, never `ddl-auto=update`
- **Soft Delete** — `@SQLRestriction("deleted_at IS NULL")` transparent to all queries
- **AOP Admin Guard** — `@RequireAdmin` intercepted by aspect, no boilerplate in controllers
- **Redis Rate Limiting** — Per-IP on auth endpoints, prevents brute force

---

## WIP / Roadmap

- [ ] File upload — listing images
- [ ] Community system — join, rank progression
- [ ] Transaction flow — escrow, COD confirmation
- [ ] Seller reviews & rating
- [ ] Dispute system
- [ ] Real-time messaging — Go WebSocket service
- [ ] Email notifications
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## Project Status

> **Active development** — Full-stack MVP complete. Auth, listing CRUD, admin panel, and responsive frontend working.

---

## Author

**Chris** — Master's student in Teknik Informatika, Universitas Hasanuddin
Full Stack Developer · Backend Engineer

*Built with Spring Boot 4.x, Next.js 15, PostgreSQL, Redis, Docker*
