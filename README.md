# Vendly

**One platform, every community's marketplace.**

Vendly is a community-driven marketplace platform where people from any interest group - automotive enthusiasts, trading card collectors, gamers, sneakerheads, and beyond - can buy, sell, and trade within their own trusted community space.

Most marketplaces treat every transaction the same way. Vendly's vision is different: each community should have a market and transaction system that reflects how its members actually trade. Collectors have grading and authentication workflows. Automotive communities have ownership and specification verification. Sneaker communities do legit checks before money changes hands. Forcing all of these into a single generic checkout flow loses the context that makes each community's trades trustworthy.

> **The goal:** Communities as first-class citizens - not just tags or categories, but actual spaces with their own rules, verification systems, and transaction flows.

This repository is the working foundation toward that vision. It covers the core infrastructure that every community marketplace needs: secure authentication, listing management, community-scoped browsing, seller reputation, and role-based administration. The schema is already designed with communities, escrow, disputes, and custom transaction types in mind - the current implementation focuses on getting the foundation production-ready before layering community-specific features on top.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Live](https://img.shields.io/badge/Live-vendly--eta.vercel.app-22c55e?style=flat-square&logo=vercel&logoColor=white)](https://vendly-eta.vercel.app)

---

## 🌐 Live Demo

|              |                                                               |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | https://vendly-eta.vercel.app                                 |
| **Backend**  | https://vendly-production-2572.up.railway.app/actuator/health |

**Try it now with these demo accounts:**

| Role      | Email            | Password |
| --------- | ---------------- | -------- |
| 🔴 Admin  | admin@vendly.id  | Test1234 |
| 🟢 Seller | seller@vendly.id | Test1234 |
| 🔵 Buyer  | buyer@vendly.id  | Test1234 |

---

## ⚙️ Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| **Backend**  | Java 21, Spring Boot 4.0.5, Spring Security 7.x |
| **Database** | PostgreSQL 17, Flyway 11.x, Hibernate 7.2       |
| **Cache**    | Redis 7                                         |
| **Auth**     | JWT (JJWT), Spring AOP                          |
| **Frontend** | Next.js 15 (App Router), TypeScript 5           |
| **UI**       | Tailwind CSS, shadcn/ui, Framer Motion          |
| **Charts**   | Recharts                                        |
| **HTTP**     | Axios with interceptors                         |
| **Infra**    | Docker Compose, Railway, Vercel                 |

---

## 📁 Project Structure

```
vendly/
├── backend/
│   ├── src/main/java/com/vendly/backend/
│   │   ├── admin/       # Admin role management via AOP
│   │   ├── auth/        # JWT, OTP, refresh token, password reset
│   │   ├── common/      # Filters, exceptions, config, rate limiting
│   │   ├── listing/     # Listing CRUD, search, soft delete
│   │   └── user/        # User profile and credit score
│   └── src/main/resources/
│       ├── db/migration/    # V1-V20 Flyway migrations
│       ├── application.yaml
│       └── application-prod.yaml
├── frontend/
│   └── src/
│       ├── app/         # Next.js App Router pages
│       ├── components/  # Reusable UI components
│       └── lib/         # API client, auth context, utilities
└── docker-compose.yml
```

---

## ✅ Features

### Backend

**🔐 Authentication and Security**

- JWT stateless auth - access tokens (15 min) in JS memory, refresh tokens (7 days) in httpOnly cookies
- Email OTP verification on registration
- Account lockout after repeated failed login attempts via Redis counters
- Forgot and reset password with time-limited tokens
- Per-IP rate limiting on auth endpoints via custom Redis-backed servlet filter
- BCrypt password hashing

**🛡️ Authorization**

- Custom `@RequireAdmin` annotation processed by Spring AOP
- Admin operations intercepted before method execution - zero boilerplate in controllers
- Role data in a dedicated `admin_roles` table

**📦 Listing System**

- Full CRUD with keyword search using PostgreSQL full-text indexing
- Condition filtering (NEW, LIKE_NEW, GOOD, FAIR)
- COD and offer negotiation flags per listing
- View count tracking
- Soft delete via `@SQLRestriction("deleted_at IS NULL")` at the ORM level

**🏗️ Infrastructure**

- 20 versioned Flyway migrations covering the full schema
- Correlation ID on every request via MDC for distributed tracing
- Structured logging with user ID and request context
- Spring Boot Actuator health and metrics endpoints
- Graceful shutdown support

### Frontend

**Pages**

- 🏠 Landing page with animated hero, category grid, and trending listings
- 🔍 Browse listings with keyword search, condition filter pills, COD/NEGO badges
- 📄 Listing detail with seller panel, delivery options, and owner actions
- ✏️ Create and edit listing with split-layout live preview (card view + detail view)
- 📊 Seller dashboard with profile card, stats (total/active/draft/sold), 7-day performance chart, and inbox
- 🔑 Admin panel - user management (grant/revoke admin) and listing management

**UX**

- Persistent auth session via refresh token cookie surviving page reloads
- Category-aware image mapping for listings
- Dark/light theme toggle
- Fully responsive layout
- Loading skeletons throughout

---

## 📡 API Reference

### Auth `/api/v1/auth`

| Method | Endpoint         | Auth   | Description                         |
| ------ | ---------------- | ------ | ----------------------------------- |
| POST   | /register        | Public | Register and trigger OTP email      |
| POST   | /verify-email    | Public | Verify email with OTP code          |
| POST   | /resend-otp      | Public | Resend OTP                          |
| POST   | /login           | Public | Login, returns JWT + refresh cookie |
| POST   | /refresh         | Cookie | Rotate access token                 |
| POST   | /logout          | Cookie | Revoke refresh token                |
| POST   | /forgot-password | Public | Request password reset link         |
| POST   | /reset-password  | Public | Submit new password with token      |

### Listings `/api/v1/listings`

| Method | Endpoint | Auth   | Description                     |
| ------ | -------- | ------ | ------------------------------- |
| GET    | /        | Public | Browse with search and filter   |
| GET    | /{id}    | Public | Get listing detail              |
| GET    | /my      | JWT    | Get authenticated user listings |
| POST   | /        | JWT    | Create listing                  |
| PUT    | /{id}    | JWT    | Update listing                  |
| DELETE | /{id}    | JWT    | Soft delete listing             |

### Users `/api/v1/users`

| Method | Endpoint      | Auth   | Description         |
| ------ | ------------- | ------ | ------------------- |
| GET    | /me           | JWT    | Get current profile |
| GET    | /{id}/profile | Public | Get public profile  |

### Admin `/api/v1/admin`

| Method | Endpoint                 | Auth  | Description        |
| ------ | ------------------------ | ----- | ------------------ |
| GET    | /users                   | Admin | List all users     |
| POST   | /users/{id}/grant-admin  | Admin | Grant admin role   |
| DELETE | /users/{id}/revoke-admin | Admin | Revoke admin role  |
| GET    | /listings                | Admin | List all listings  |
| DELETE | /listings/{id}           | Admin | Delete any listing |

---

## 🗄️ Database Schema

20 Flyway migrations covering the full planned schema:

| Migration | Tables                                                         |
| --------- | -------------------------------------------------------------- |
| V1-V2     | `users`, `user_tokens`, `admin_roles`                          |
| V3        | `credit_score_history`, `bans`                                 |
| V4        | `file_uploads`                                                 |
| V5        | `tags`, `entity_tags` (ABAC foundation)                        |
| V6        | `communities`, `channels`, `messages`                          |
| V7        | `listings`, `listing_images`                                   |
| V8        | `transactions`, `offers`, `price_requests`, `private_messages` |
| V9        | `disputes`, `dispute_messages`, `dispute_evidences`            |
| V10-V11   | `notifications`, `email_logs`                                  |
| V12       | `stores`, `store_policies`, `store_followers`                  |
| V13       | Seed data (admin + demo accounts)                              |
| V14       | `password_resets`                                              |
| V15       | `seller_reviews`                                               |
| V16       | `reports`                                                      |
| V17-V19   | Soft delete columns and indexes                                |
| V20       | Seed listing data (8 demo listings)                            |

> The schema is already designed with communities, escrow, disputes, and custom transaction types in mind. The database is ready - the application catches up in phases.

---

## 🚀 Local Setup

**Prerequisites:** Docker Desktop 4.x, Node.js 20+

```bash
git clone https://github.com/ChrisSlat0910/vendly.git
cd vendly

# Start backend services
docker compose up postgres redis backend

# Verify backend is running
curl http://localhost:8080/actuator/health

# Start frontend (separate terminal)
cd frontend
npm install
npm run dev
```

**Environment variables:**

```env
POSTGRES_DB=vendly
POSTGRES_USER=vendly_user
POSTGRES_PASSWORD=vendly123
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_ACCESS_TOKEN_EXPIRY_MS=900000
JWT_REFRESH_TOKEN_EXPIRY_MS=604800000
APP_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 🧠 Design Decisions

**Stateless JWT with cookie-based refresh**
Access tokens live in JavaScript memory only (never localStorage), making them invisible to XSS. Refresh tokens are stored in httpOnly cookies scoped strictly to `/api/v1/auth`, so they cannot be read by client-side scripts.

**Flyway over Hibernate DDL**
Every schema change is a versioned, reviewable SQL file. `ddl-auto` is set to `validate` in all environments. The database is never modified by the ORM automatically.

**Soft delete via `@SQLRestriction`**
Deleted records are filtered at the Hibernate session level. No repository or service code needs to know about soft deletion - it is completely transparent to the rest of the application.

**AOP-based admin authorization**
`@RequireAdmin` is a custom annotation intercepted by `AdminAspect`. The aspect checks the `admin_roles` table before the method executes. Controllers contain zero security logic.

**Redis rate limiting**
A custom `RateLimitFilter` runs before Spring Security on auth endpoints. It increments a Redis counter per IP and returns HTTP 429 before any authentication processing occurs.

**Community-first schema**
The database schema treats communities as first-class entities from day one. The ABAC tag system (V5) is the foundation for community-specific permission rules that will power custom transaction flows in later phases.

---

## ☁️ Deployment

| Service  | Platform             |
| -------- | -------------------- |
| Frontend | Vercel               |
| Backend  | Railway              |
| Database | Railway (PostgreSQL) |
| Cache    | Railway (Redis)      |

---

## 🗺️ Roadmap

Planned features in order of priority:

- [ ] Listing image upload with file storage
- [ ] Community system with member ranks and channel-based listing scopes
- [ ] Custom transaction flows per community type
- [ ] Escrow payment system
- [ ] Seller reviews and credit score updates
- [ ] Dispute resolution system
- [ ] Real-time messaging via WebSocket
- [ ] Email notifications
- [ ] Store profiles for power sellers
- [ ] CI/CD pipeline with automated testing

---

## 📊 Status

Active development. Core infrastructure (auth, listings, admin, community schema) is production-deployed. The next phase focuses on community features and transaction flows.

---

## Author

Chris  
Master's student in Informatics Engineering, Hasanuddin University  
[github.com/ChrisSlat0910](https://github.com/ChrisSlat0910)
