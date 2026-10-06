# Job Portal Application: Complete Technical Documentation

**Stack:** React.js · Java Spring Boot · REST + JSON · PostgreSQL / MySQL
**Document type:** Architecture & design reference

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Frontend (React.js) Architecture](#4-frontend-reactjs-architecture)
5. [Backend (Java) Architecture](#5-backend-java-architecture)
6. [REST API + JSON Request/Response Flow](#6-rest-api--json-requestresponse-flow)
7. [Database Design & ER Diagram](#7-database-design--er-diagram)
8. [User Registration and Login Flow](#8-user-registration-and-login-flow)
9. [Job Seeker Workflow](#9-job-seeker-workflow)
10. [Recruiter / Employer Workflow](#10-recruiter--employer-workflow)
11. [Job Posting Workflow](#11-job-posting-workflow)
12. [Job Search and Filtering](#12-job-search-and-filtering)
13. [Job Application Workflow](#13-job-application-workflow)
14. [Authentication and Authorization](#14-authentication-and-authorization)
15. [Admin Workflow](#15-admin-workflow)
16. [Complete End-to-End Data Flow](#16-complete-end-to-end-data-flow)
17. [Suggested Project Folder Structure](#17-suggested-project-folder-structure)
18. [Example React Components](#18-example-react-components)
19. [Example Java REST Controllers and Services](#19-example-java-rest-controllers-and-services)
20. [Example JSON APIs](#20-example-json-apis)
21. [Database Tables (DDL)](#21-database-tables-ddl)
22. [Deployment Architecture](#22-deployment-architecture)
23. [Conclusion and Future Enhancements](#23-conclusion-and-future-enhancements)

---

## 1. Project Overview

The **Job Portal Application** is a web platform that connects **job seekers** with **employers/recruiters**.

### 1.1 Goals

- Let job seekers register, build a profile, upload resumes, search and filter jobs, and apply.
- Let recruiters create company profiles, post jobs, review applicants and update application status.
- Let administrators moderate users, companies and job postings, and view platform statistics.

### 1.2 User Roles

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| `JOB_SEEKER` | Candidate looking for work | Profile, resume upload, search, apply, track applications, save jobs |
| `RECRUITER` | Employer representative | Company profile, post/edit/close jobs, view applicants, change status |
| `ADMIN` | Platform operator | Approve companies/jobs, block users, reports, system settings |

### 1.3 Functional Scope

- Authentication (register, login, logout, refresh token, password reset)
- Role-based access control
- Job CRUD with approval workflow
- Search with keyword, location, category, salary, experience and job-type filters, plus pagination
- Application submission and status tracking
- Resume upload and storage
- Email notifications (application received, status changed)
- Admin dashboard

### 1.4 Non-Functional Requirements

| Area | Target |
|------|--------|
| Security | BCrypt passwords, JWT, HTTPS, input validation, CORS policy |
| Performance | Paginated queries, DB indexes, p95 API latency under 300 ms for search |
| Scalability | Stateless backend, horizontally scalable behind a load balancer |
| Maintainability | Layered architecture, DTOs, automated tests, CI/CD |
| Availability | Health checks, rolling deployments, database backups |

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, React Router, Axios, Context API / Redux Toolkit, Vite | SPA UI, routing, API calls, state |
| **UI** | Tailwind CSS / Material UI | Styling and components |
| **Backend** | Java 17+, Spring Boot 3, Spring Web | REST API |
| **Security** | Spring Security, JWT (jjwt), BCrypt | Authentication & authorization |
| **Persistence** | Spring Data JPA, Hibernate | ORM and repositories |
| **Data format** | JSON (Jackson) | Request/response payloads |
| **Database** | PostgreSQL 15+ *or* MySQL 8+ | Relational storage |
| **Migrations** | Flyway / Liquibase | Versioned schema changes |
| **File storage** | Local disk (dev), S3-compatible storage (prod) | Resumes, logos |
| **API docs** | springdoc-openapi (Swagger UI) | Interactive API documentation |
| **Testing** | JUnit 5, Mockito, Testcontainers, Jest, React Testing Library | Unit & integration tests |
| **DevOps** | Docker, Docker Compose, Nginx, GitHub Actions | Build, containerize, deploy |

### 2.1 JSON Data Exchange

All API requests and responses use `Content-Type: application/json` (except resume upload, which uses `multipart/form-data`). Jackson serializes Java DTOs to JSON on the server; Axios parses JSON into JavaScript objects on the client.

---

## 3. System Architecture

### 3.1 High-Level Architecture

```text
                        JOB PORTAL APPLICATION
                                  │
                   ┌──────────────┴──────────────┐
                   │                             │
             React.js Frontend             Users / Admin
        (Job Seeker · Recruiter · Admin)   (Browser / Mobile)
                   │
                   │  HTTPS · REST + JSON  (Authorization: Bearer <JWT>)
                   ▼
          ┌─────────────────────┐
          │   Java Spring Boot  │
          │   (API Gateway/App) │
          └─────────┬───────────┘
                    │
        ┌───────────┼───────────────┬───────────────┐
        │           │               │               │
    Auth API     Job API    Application API     Admin API
        │           │               │               │
        └───────────┼───────────────┴───────────────┘
                    │  Spring Data JPA
                    ▼
            Database Server (PostgreSQL / MySQL)
            ┌──────────────────┐
            │ users            │
            │ jobs             │
            │ companies        │
            │ applications     │
            │ resumes          │
            └──────────────────┘
```

### 3.2 Layered View

```text
┌───────────────────────────────────────────────────────────┐
│ PRESENTATION   React components · pages · routes          │
├───────────────────────────────────────────────────────────┤
│ CLIENT SERVICES  Axios instance · interceptors · hooks    │
├───────────────────────────────────────────────────────────┤
│ API LAYER      Spring @RestController · DTO validation    │
├───────────────────────────────────────────────────────────┤
│ SERVICE LAYER  Business rules · transactions · mapping    │
├───────────────────────────────────────────────────────────┤
│ DATA ACCESS    Spring Data JPA repositories · Specs       │
├───────────────────────────────────────────────────────────┤
│ DATABASE       PostgreSQL / MySQL                         │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Frontend (React.js) Architecture

### 4.1 Component Hierarchy

```text
<App>
 ├── <AuthProvider>                  (user, token, login/logout)
 │    └── <Router>
 │         ├── <Navbar />
 │         ├── Public routes
 │         │    ├── <HomePage />
 │         │    ├── <JobListPage />       → <SearchFilters/> <JobCard/>* <Pagination/>
 │         │    ├── <JobDetailPage />     → <ApplyButton/>
 │         │    ├── <LoginPage />         → <LoginForm/>
 │         │    └── <RegisterPage />      → <RegisterForm/>
 │         ├── <ProtectedRoute role="JOB_SEEKER">
 │         │    ├── <SeekerDashboard />
 │         │    ├── <MyApplications />
 │         │    └── <ProfilePage /> → <ResumeUpload/>
 │         ├── <ProtectedRoute role="RECRUITER">
 │         │    ├── <RecruiterDashboard />
 │         │    ├── <PostJobPage /> → <JobForm/>
 │         │    ├── <MyJobs />
 │         │    └── <ApplicantsPage />
 │         └── <ProtectedRoute role="ADMIN">
 │              ├── <AdminDashboard />
 │              ├── <ManageUsers />
 │              └── <ModerateJobs />
 └── <Footer />
```

### 4.2 Frontend Data Flow

```text
User action (click / submit)
        │
        ▼
React Component ──► custom hook / service function
        │                     │
        │                     ▼
        │            Axios instance (adds JWT header)
        │                     │  HTTP + JSON
        │                     ▼
        │               Spring Boot API
        │                     │
        │◄────────────────────┘  JSON response
        ▼
setState / Context update ──► UI re-renders
```

### 4.3 State Management

| State type | Tool |
|-----------|------|
| Auth (user, token) | React Context (`AuthContext`) |
| Server data (jobs, applications) | React Query / TanStack Query *(recommended)* or local `useState` |
| Form state | React Hook Form |
| URL state (filters, page) | `useSearchParams` from React Router |

### 4.4 Token Handling

- Access token (short-lived, ~15 min) kept in memory; refresh token in an `HttpOnly` cookie *(preferred)*, or in `localStorage` for simple setups, with the XSS trade-off understood.
- An Axios **request interceptor** attaches `Authorization: Bearer <token>`.
- An Axios **response interceptor** handles `401` by trying `/api/auth/refresh`, then redirecting to login on failure.

---

## 5. Java Backend Architecture

### 5.1 Layers and Responsibilities

| Layer | Package | Responsibility |
|-------|---------|----------------|
| Controller | `controller` | HTTP mapping, request validation, return DTOs |
| Service | `service` | Business logic, transactions, authorization checks |
| Repository | `repository` | Database access via Spring Data JPA |
| Entity | `entity` | JPA-mapped domain model |
| DTO | `dto` | Request/response contracts (never expose entities directly) |
| Mapper | `mapper` | Entity ↔ DTO conversion (MapStruct) |
| Security | `security` | JWT filter, UserDetailsService, config |
| Exception | `exception` | Global error handling (`@RestControllerAdvice`) |
| Config | `config` | CORS, OpenAPI, file storage, async |

### 5.2 Request Processing Pipeline

```text
HTTP Request
    │
    ▼
CORS Filter ─► JwtAuthenticationFilter ─► Spring Security (role checks)
    │
    ▼
@RestController   (@Valid DTO binding)
    │
    ▼
@Service          (business rules, @Transactional)
    │
    ▼
JpaRepository     (SQL via Hibernate)
    │
    ▼
Database
    │
    ▼  (reverse path)
Entity → Mapper → Response DTO → Jackson → JSON → HTTP Response
    │
    ▼
GlobalExceptionHandler (on any error → standard JSON error body)
```

### 5.3 Main Modules

```text
Auth Module         : register, login, refresh, forgot/reset password
User Module         : profile, resume upload, saved jobs
Company Module      : company profile, logo, verification status
Job Module          : CRUD, search/filter, status (DRAFT/PENDING/OPEN/CLOSED)
Application Module  : apply, withdraw, status updates, applicant listing
Admin Module        : user management, moderation, statistics
Notification Module : email events (async)
```

---

## 6. REST API + JSON Request/Response Flow

### 6.1 Generic Flow

```text
React (Axios)                    Spring Boot                       Database
     │                                │                                │
     │ 1. POST /api/applications      │                                │
     │    Authorization: Bearer JWT   │                                │
     │    { "jobId": 12, ... }  ────► │                                │
     │                                │ 2. JWT filter validates token  │
     │                                │ 3. Controller validates DTO    │
     │                                │ 4. Service applies rules       │
     │                                │ 5. Repository.save() ────────► │
     │                                │                                │ 6. INSERT
     │                                │ ◄──────────────────────────────│
     │ ◄── 201 Created + JSON ─────── │ 7. Map entity → response DTO   │
     │ 8. Update UI                   │                                │
```

### 6.2 API Endpoint Catalogue

**Auth**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register seeker or recruiter |
| POST | `/api/auth/login` | Public | Login, returns tokens |
| POST | `/api/auth/refresh` | Public | New access token |
| POST | `/api/auth/logout` | Auth | Invalidate refresh token |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| POST | `/api/auth/reset-password` | Public | Reset with token |

**Users / Profile**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/me` | Auth | Current user profile |
| PUT | `/api/users/me` | Auth | Update profile |
| POST | `/api/users/me/resumes` | Seeker | Upload resume (multipart) |
| GET | `/api/users/me/resumes` | Seeker | List resumes |
| DELETE | `/api/users/me/resumes/{id}` | Seeker | Delete resume |

**Companies**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/companies` | Recruiter | Create company |
| GET | `/api/companies/{id}` | Public | Company details |
| PUT | `/api/companies/{id}` | Recruiter (owner) | Update company |

**Jobs**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs` | Public | Search/filter/paginate |
| GET | `/api/jobs/{id}` | Public | Job detail |
| POST | `/api/jobs` | Recruiter | Create job |
| PUT | `/api/jobs/{id}` | Recruiter (owner) | Update job |
| PATCH | `/api/jobs/{id}/status` | Recruiter (owner) | Close/reopen |
| DELETE | `/api/jobs/{id}` | Recruiter (owner)/Admin | Delete job |
| POST | `/api/jobs/{id}/save` | Seeker | Bookmark job |

**Applications**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/applications` | Seeker | Apply to a job |
| GET | `/api/applications/me` | Seeker | My applications |
| DELETE | `/api/applications/{id}` | Seeker | Withdraw |
| GET | `/api/jobs/{jobId}/applications` | Recruiter (owner) | Applicants for a job |
| PATCH | `/api/applications/{id}/status` | Recruiter (owner) | Update status |

**Admin**

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/users` | Admin | List users |
| PATCH | `/api/admin/users/{id}/status` | Admin | Block/unblock |
| GET | `/api/admin/jobs/pending` | Admin | Jobs awaiting approval |
| PATCH | `/api/admin/jobs/{id}/approval` | Admin | Approve/reject |
| PATCH | `/api/admin/companies/{id}/verify` | Admin | Verify company |
| GET | `/api/admin/stats` | Admin | Dashboard metrics |

### 6.3 Standard Response Conventions

| Status | Meaning |
|--------|---------|
| 200 OK | Successful read/update |
| 201 Created | Resource created |
| 204 No Content | Successful delete |
| 400 Bad Request | Validation error |
| 401 Unauthorized | Missing/invalid token |
| 403 Forbidden | Role/ownership violation |
| 404 Not Found | Resource missing |
| 409 Conflict | Duplicate (e.g., already applied) |
| 500 Internal Server Error | Unexpected error |

---

## 7. Database Design & ER Diagram

### 7.1 Entity-Relationship Diagram

```text
┌──────────────┐ 1        1 ┌──────────────────┐
│    users     │────────────│  user_profiles   │
│──────────────│            │──────────────────│
│ id (PK)      │            │ user_id (PK,FK)  │
│ email        │            │ headline, skills │
│ password_hash│            │ experience_years │
│ full_name    │            └──────────────────┘
│ role         │
│ status       │ 1        N ┌──────────────────┐
│              │────────────│     resumes      │
└──────┬───────┘            │──────────────────│
       │                    │ id (PK)          │
       │ 1                  │ user_id (FK)     │
       │                    │ file_name, path  │
       │ N                  └────────┬─────────┘
┌──────▼───────┐                     │ 1
│  companies   │                     │
│──────────────│                     │ N
│ id (PK)      │ 1        N ┌────────▼─────────┐ N        1 ┌──────────────┐
│ owner_id(FK) │────────────│   applications   │────────────│    users     │
│ name         │            │──────────────────│ (seeker)   │  (seeker)    │
│ website      │            │ id (PK)          │            └──────────────┘
│ verified     │            │ job_id (FK)      │
└──────┬───────┘            │ seeker_id (FK)   │
       │ 1                  │ resume_id (FK)   │
       │                    │ cover_letter     │
       │ N                  │ status           │
┌──────▼───────┐ 1        N │ applied_at       │
│     jobs     │────────────│ UNIQUE(job,user) │
│──────────────│            └──────────────────┘
│ id (PK)      │
│ company_id   │ N        N ┌──────────────────┐
│ posted_by    │────────────│   saved_jobs     │ (user_id, job_id)
│ title        │            └──────────────────┘
│ description  │
│ location     │ N        1 ┌──────────────────┐
│ job_type     │────────────│   categories     │
│ salary_min/  │            └──────────────────┘
│   salary_max │
│ experience   │            ┌──────────────────┐
│ status       │            │ refresh_tokens   │ (user_id FK)
│ category_id  │            │ notifications    │ (user_id FK)
└──────────────┘            └──────────────────┘
```

### 7.2 Relationships Summary

| Relationship | Type |
|--------------|------|
| User → UserProfile | One-to-One |
| User → Resumes | One-to-Many |
| User (recruiter) → Companies | One-to-Many |
| Company → Jobs | One-to-Many |
| Category → Jobs | One-to-Many |
| Job → Applications | One-to-Many |
| User (seeker) → Applications | One-to-Many |
| Users ↔ Jobs (saved) | Many-to-Many via `saved_jobs` |

### 7.3 Indexing Strategy

- `users(email)` unique
- `jobs(status, created_at DESC)` for listing
- `jobs(location)`, `jobs(category_id)`, `jobs(job_type)` for filters
- Full-text index on `jobs(title, description)` (PostgreSQL `tsvector` + GIN, or MySQL `FULLTEXT`)
- `applications(job_id)`, `applications(seeker_id)`; unique `(job_id, seeker_id)`

---

## 8. User Registration and Login Flow

### 8.1 Registration

```text
User
 │  fills form (name, email, password, role)
 ▼
React RegisterForm  ── client-side validation
 │
 ▼
POST /api/auth/register  { fullName, email, password, role }
 │
 ▼
AuthController ── @Valid
 │
 ▼
AuthService
 ├─ email already exists? ──► 409 Conflict
 ├─ hash password (BCrypt)
 ├─ save User (status = ACTIVE / PENDING_VERIFICATION)
 ├─ create empty profile
 └─ send verification email (async)
 │
 ▼
201 Created + JSON user summary
 │
 ▼
React redirects to Login
```

### 8.2 Login

```text
User
 │
 ▼
React LoginForm
 │
 ▼
POST /api/auth/login { email, password }
 │
 ▼
AuthController ──► AuthService
 │                      │
 │                      ├─ AuthenticationManager.authenticate()
 │                      │       │
 │                      │       ▼
 │                      │   Database ──► load user ──► verify BCrypt hash
 │                      │
 │                      ├─ generate access JWT (15 min) + refresh token (7 days)
 │                      └─ store refresh token (hashed) in DB
 ▼
200 OK { accessToken, refreshToken, user:{id,name,role} }
 │
 ▼
React AuthContext stores user/token ──► redirect by role:
    JOB_SEEKER → /dashboard    RECRUITER → /recruiter    ADMIN → /admin
```

### 8.3 Token Refresh

```text
API call → 401 (expired access token)
   → Axios interceptor → POST /api/auth/refresh { refreshToken }
   → valid? → new access token → retry original request
   → invalid? → clear session → redirect /login
```

---

## 9. Job Seeker Workflow

```text
Register / Login
      │
      ▼
Complete Profile (skills, experience, summary)
      │
      ▼
Upload Resume (PDF/DOCX)  ──► POST /api/users/me/resumes
      │
      ▼
Search Jobs (keyword + filters)  ──► GET /api/jobs?...
      │
      ▼
View Job Detail  ──► GET /api/jobs/{id}
      │
      ├──► Save Job (bookmark)  ──► POST /api/jobs/{id}/save
      │
      ▼
Apply (choose resume + cover letter)  ──► POST /api/applications
      │
      ▼
Track Applications  ──► GET /api/applications/me
      │            status: APPLIED → REVIEWED → SHORTLISTED → INTERVIEW → OFFERED / REJECTED
      ▼
Receive email/in-app notification on status change
```

---

## 10. Recruiter / Employer Workflow

```text
Register as Recruiter / Login
      │
      ▼
Create Company Profile ──► POST /api/companies   (verified = false)
      │
      ▼
(Optional) Admin verifies company
      │
      ▼
Post Job ──► POST /api/jobs   (status = PENDING_APPROVAL or OPEN)
      │
      ▼
Manage Jobs: edit · close · reopen · delete
      │
      ▼
View Applicants ──► GET /api/jobs/{jobId}/applications
      │
      ▼
Review resume + cover letter
      │
      ▼
Update Status ──► PATCH /api/applications/{id}/status
      │          (REVIEWED / SHORTLISTED / INTERVIEW / OFFERED / REJECTED)
      ▼
Seeker notified automatically
```

---

## 11. Job Posting Workflow

```text
Recruiter fills JobForm (title, description, location, type, salary, skills, deadline)
      │
      ▼
React validation
      │
      ▼
POST /api/jobs
      │
      ▼
JobController ── @PreAuthorize("hasRole('RECRUITER')")
      │
      ▼
JobService
  ├─ verify recruiter owns the company
  ├─ company verified? ── yes ──► status = OPEN
  │                       no  ──► status = PENDING_APPROVAL
  └─ save Job
      │
      ▼
201 Created + job JSON
      │
      ▼
[If PENDING_APPROVAL] Admin approves → status = OPEN → visible in search
```

**Job status lifecycle**

```text
DRAFT → PENDING_APPROVAL → OPEN → CLOSED
                │             │
                └─► REJECTED  └─► EXPIRED (deadline passed, scheduled job)
```

---

## 12. Job Search and Filtering

### 12.1 Query Parameters

`GET /api/jobs?keyword=java&location=Mumbai&type=FULL_TIME&category=3&minSalary=600000&maxSalary=1500000&experience=2&sort=createdAt,desc&page=0&size=10`

| Param | Type | Description |
|-------|------|-------------|
| `keyword` | string | Matches title/description/skills |
| `location` | string | City/region |
| `type` | enum | FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE |
| `category` | long | Category id |
| `minSalary` / `maxSalary` | number | Salary range |
| `experience` | int | Max years required |
| `sort` | string | e.g. `createdAt,desc` |
| `page` / `size` | int | Pagination |

### 12.2 Flow

```text
User types keyword / selects filters
      │  (debounce 300 ms)
      ▼
React updates URL params ──► GET /api/jobs?...
      │
      ▼
JobController ──► JobService.search(filter, pageable)
      │
      ▼
JobSpecification builds dynamic WHERE clauses
      │   status = 'OPEN' AND (title LIKE ...) AND location = ... AND salary BETWEEN ...
      ▼
JobRepository.findAll(spec, pageable) ──► Database (indexed)
      │
      ▼
Page<Job> → Page<JobResponse> → JSON { content[], page, totalPages, totalElements }
      │
      ▼
React renders <JobCard/> list + <Pagination/>
```

---

## 13. Job Application Workflow

```text
Job Seeker clicks "Apply"
      │
      ▼
Not logged in? ──► redirect to /login (return to job afterwards)
      │
      ▼
Select resume + write cover letter
      │
      ▼
POST /api/applications { jobId, resumeId, coverLetter }
      │
      ▼
ApplicationService
  ├─ job exists and status == OPEN and deadline not passed?
  ├─ already applied? (unique job+seeker) ──► 409 Conflict
  ├─ resume belongs to this seeker?
  ├─ save Application(status = APPLIED)
  └─ publish event → email recruiter + confirm to seeker
      │
      ▼
201 Created { id, status:"APPLIED", appliedAt }
      │
      ▼
React shows success toast, button becomes "Applied ✓"
```

**Application status lifecycle**

```text
APPLIED → REVIEWED → SHORTLISTED → INTERVIEW → OFFERED
   │          │           │            │
   └──────────┴───────────┴────────────┴──► REJECTED
APPLIED ... ──► WITHDRAWN (by seeker)
```

---

## 14. Authentication and Authorization

### 14.1 JWT Structure

```text
Header   : { "alg": "HS256", "typ": "JWT" }
Payload  : { "sub": "42", "email": "a@b.com", "role": "RECRUITER",
             "iat": 1735900000, "exp": 1735900900 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), SECRET)
```

### 14.2 Per-Request Authentication

```text
Request with  Authorization: Bearer <JWT>
      │
      ▼
JwtAuthenticationFilter
  ├─ extract token
  ├─ validate signature + expiry
  ├─ load user (or build from claims)
  └─ set SecurityContext (authorities = ROLE_xxx)
      │
      ▼
Authorization rules
  ├─ URL rules in SecurityFilterChain
  ├─ @PreAuthorize on methods
  └─ ownership checks inside services
      │
      ├─ allowed → controller
      └─ denied  → 401 / 403 JSON error
```

### 14.3 Access Matrix

| Resource | Public | Seeker | Recruiter | Admin |
|----------|:------:|:------:|:---------:|:-----:|
| Browse/search jobs | ✔ | ✔ | ✔ | ✔ |
| Apply to job | ✘ | ✔ | ✘ | ✘ |
| View own applications | ✘ | ✔ | ✘ | ✘ |
| Post/edit own jobs | ✘ | ✘ | ✔ | ✔ |
| View applicants of own job | ✘ | ✘ | ✔ | ✔ |
| Approve jobs / block users | ✘ | ✘ | ✘ | ✔ |

### 14.4 Security Checklist

- BCrypt (strength 10–12) for passwords
- HTTPS everywhere; HSTS
- Short-lived access tokens; rotate refresh tokens
- Strict CORS (only the frontend origin)
- Bean Validation on all DTOs; parameterized queries (JPA) to prevent SQL injection
- Escape/sanitize rich-text job descriptions (prevent XSS)
- Resume upload: type/size whitelist, randomized file names, virus scan (optional)
- Rate limiting on login and register endpoints
- Never return password hashes or internal stack traces

---

## 15. Admin Workflow

```text
Admin logs in ──► /admin dashboard
      │
      ├── Dashboard stats  ──► GET /api/admin/stats
      │      (users, active jobs, applications/day, top categories)
      │
      ├── Manage Users
      │      list/search ──► GET /api/admin/users
      │      block/unblock ──► PATCH /api/admin/users/{id}/status
      │
      ├── Company Verification
      │      review ──► PATCH /api/admin/companies/{id}/verify
      │
      ├── Job Moderation
      │      pending list ──► GET /api/admin/jobs/pending
      │      approve/reject ──► PATCH /api/admin/jobs/{id}/approval
      │      remove abusive job ──► DELETE /api/jobs/{id}
      │
      └── Master data: categories, skills, system settings
```

---

## 16. Complete End-to-End Data Flow

```text
Job Seeker
    │
    ▼
React Login ──► POST /api/auth/login
    │
    ▼
Java Authentication API
    │
    ▼
Database ───────► Verify User (email + BCrypt hash)
    │
    ▼
JWT (access + refresh) returned
    │
    ▼
React stores token in AuthContext
    │
    ▼
React Job Search page
    │
    ▼
GET /api/jobs?keyword=...&location=...        (Bearer JWT optional)
    │
    ▼
Java JobController
    │
    ▼
JobService (JobSpecification + Pageable)
    │
    ▼
Database (jobs ⨝ companies ⨝ categories)
    │
    ▼
JSON Response  { content:[...], totalPages, totalElements }
    │
    ▼
React Job List (JobCard × N)
    │
    ▼
User opens Job Detail ──► GET /api/jobs/{id}
    │
    ▼
Apply for Job (select resume, cover letter)
    │
    ▼
POST /api/applications       (Bearer JWT, role = JOB_SEEKER)
    │
    ▼
JwtAuthenticationFilter → ApplicationController
    │
    ▼
Java ApplicationService (validate, de-duplicate)
    │
    ▼
applications table  ◄── INSERT (status = APPLIED)
    │
    ├──► Event → Email to Recruiter + Seeker confirmation
    │
    ▼
201 Created JSON
    │
    ▼
React shows "Applied ✓"
    │
    ▼
Recruiter dashboard ──► GET /api/jobs/{id}/applications ──► reviews ──► PATCH status
    │
    ▼
Seeker sees updated status in "My Applications"
```

---

## 17. Suggested Project Folder Structure

### 17.1 Monorepo Layout

```text
job-portal/
├── frontend/                     # React application
├── backend/                      # Spring Boot application
├── docker/                       # Dockerfiles, nginx.conf
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

### 17.2 Frontend

```text
frontend/
├── public/
├── src/
│   ├── api/
│   │   ├── axiosClient.js        # Axios instance + interceptors
│   │   ├── authApi.js
│   │   ├── jobApi.js
│   │   └── applicationApi.js
│   ├── assets/
│   ├── components/
│   │   ├── common/               # Button, Modal, Loader, Pagination
│   │   ├── layout/               # Navbar, Footer, Sidebar
│   │   └── jobs/                 # JobCard, SearchFilters, JobForm, ApplyButton
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useJobs.js
│   ├── pages/
│   │   ├── public/               # Home, JobList, JobDetail, Login, Register
│   │   ├── seeker/               # Dashboard, MyApplications, Profile
│   │   ├── recruiter/            # Dashboard, PostJob, MyJobs, Applicants
│   │   └── admin/                # Dashboard, Users, ModerateJobs
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env                          # VITE_API_BASE_URL=http://localhost:8080/api
├── package.json
└── vite.config.js
```

### 17.3 Backend

```text
backend/
├── src/main/java/com/jobportal/
│   ├── JobPortalApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── OpenApiConfig.java
│   │   └── FileStorageConfig.java
│   ├── security/
│   │   ├── SecurityConfig.java
│   │   ├── JwtService.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── CompanyController.java
│   │   ├── JobController.java
│   │   ├── ApplicationController.java
│   │   └── AdminController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── JobService.java
│   │   ├── ApplicationService.java
│   │   └── impl/ ...
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── JobRepository.java
│   │   ├── CompanyRepository.java
│   │   └── ApplicationRepository.java
│   ├── entity/
│   │   ├── User.java  Job.java  Company.java  Application.java  Resume.java
│   │   └── enums/ Role.java  JobStatus.java  JobType.java  ApplicationStatus.java
│   ├── dto/
│   │   ├── auth/  LoginRequest.java  RegisterRequest.java  AuthResponse.java
│   │   ├── job/   JobRequest.java  JobResponse.java  JobFilter.java
│   │   └── application/ ApplicationRequest.java  ApplicationResponse.java
│   ├── mapper/
│   ├── specification/JobSpecification.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       ├── ResourceNotFoundException.java
│       └── DuplicateApplicationException.java
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/V1__init_schema.sql
├── src/test/java/...
└── pom.xml
```

---

## 18. Example React Components

### 18.1 Axios Client with Interceptors (`api/axiosClient.js`)

```javascript
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = sessionStorage.getItem("refreshToken");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        sessionStorage.setItem("accessToken", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosClient(original);
      } catch {
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

### 18.2 Auth Context (`context/AuthContext.jsx`)

```jsx
import { createContext, useContext, useState } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const { data } = await axiosClient.post("/auth/login", { email, password });
    sessionStorage.setItem("accessToken", data.accessToken);
    sessionStorage.setItem("refreshToken", data.refreshToken);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 18.3 Protected Route (`routes/ProtectedRoute.jsx`)

```jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
```

### 18.4 Login Form (`components/auth/LoginForm.jsx`)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      const home = { JOB_SEEKER: "/dashboard", RECRUITER: "/recruiter", ADMIN: "/admin" };
      navigate(home[user.role] ?? "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Login</h2>
      {error && <p className="text-red-600">{error}</p>}
      <input name="email" type="email" placeholder="Email"
             value={form.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password"
             value={form.password} onChange={handleChange} required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 18.5 Job List with Search & Filters (`pages/public/JobListPage.jsx`)

```jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import JobCard from "../../components/jobs/JobCard";

export default function JobListPage() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = Number(params.get("page") ?? 0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    axiosClient
      .get("/jobs", { params: Object.fromEntries(params), signal: controller.signal })
      .then(({ data }) => {
        setJobs(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [params]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(params);
    value !== "" && value != null ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.set("page", 0);   // reset to first page when a filter changes
    setParams(next);
  };

  return (
    <div>
      <div className="filters">
        <input placeholder="Keyword" defaultValue={params.get("keyword") ?? ""}
               onChange={(e) => updateFilter("keyword", e.target.value)} />
        <input placeholder="Location" defaultValue={params.get("location") ?? ""}
               onChange={(e) => updateFilter("location", e.target.value)} />
        <select value={params.get("type") ?? ""}
                onChange={(e) => updateFilter("type", e.target.value)}>
          <option value="">All types</option>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : jobs.map((job) => <JobCard key={job.id} job={job} />)}

      <div className="pagination">
        <button disabled={page === 0} onClick={() => updateFilter("page", page - 1)}>Prev</button>
        <span>{page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => updateFilter("page", page + 1)}>Next</button>
      </div>
    </div>
  );
}
```

> Tip: debounce the keyword input (e.g., 300 ms) so a request is not sent on every keystroke.

### 18.6 Job Card (`components/jobs/JobCard.jsx`)

```jsx
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold">
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
      </h3>
      <p>{job.company.name} · {job.location}</p>
      <p>{job.jobType.replace("_", " ")} · ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}</p>
      <p className="text-sm text-gray-500">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

### 18.7 Apply Button (`components/jobs/ApplyButton.jsx`)

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";

export default function ApplyButton({ jobId, resumes }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumeId, setResumeId] = useState(resumes?.[0]?.id ?? "");
  const [coverLetter, setCoverLetter] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | applied | error
  const [message, setMessage] = useState("");

  const apply = async () => {
    if (!user) return navigate("/login");
    setStatus("loading");
    try {
      await axiosClient.post("/applications", { jobId, resumeId, coverLetter });
      setStatus("applied");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.status === 409
        ? "You have already applied to this job."
        : err.response?.data?.message || "Something went wrong");
    }
  };

  if (status === "applied") return <button disabled>Applied ✓</button>;

  return (
    <div>
      <select value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
        {resumes?.map((r) => <option key={r.id} value={r.id}>{r.fileName}</option>)}
      </select>
      <textarea placeholder="Cover letter" value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)} />
      <button onClick={apply} disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Apply Now"}
      </button>
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  );
}
```

### 18.8 Route Configuration (`routes/AppRoutes.jsx`)

```jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute role="JOB_SEEKER" />}>
        <Route path="/dashboard" element={<SeekerDashboard />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Route>

      <Route element={<ProtectedRoute role="RECRUITER" />}>
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/post-job" element={<PostJobPage />} />
        <Route path="/recruiter/jobs/:id/applicants" element={<ApplicantsPage />} />
      </Route>

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
```

---

## 19. Example Java REST Controllers and Services

### 19.1 `pom.xml` Key Dependencies

```xml
<dependencies>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
  <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
  <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
  <!-- For MySQL use: com.mysql:mysql-connector-j -->
  <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-api</artifactId><version>0.12.5</version></dependency>
  <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-impl</artifactId><version>0.12.5</version><scope>runtime</scope></dependency>
  <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt-jackson</artifactId><version>0.12.5</version><scope>runtime</scope></dependency>
  <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-core</artifactId></dependency>
  <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId><version>2.5.0</version></dependency>
  <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
</dependencies>
```

### 19.2 `application.yml`

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobportal
    # MySQL: jdbc:mysql://localhost:3306/jobportal
    username: ${DB_USER:jobportal}
    password: ${DB_PASSWORD:changeme}
  jpa:
    hibernate:
      ddl-auto: validate        # schema owned by Flyway
    open-in-view: false
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 5MB

app:
  jwt:
    secret: ${JWT_SECRET}        # at least 256-bit, Base64-encoded
    access-expiry-minutes: 15
    refresh-expiry-days: 7
  cors:
    allowed-origin: ${FRONTEND_URL:http://localhost:5173}
```

### 19.3 Entities

```java
@Entity
@Table(name = "jobs")
@Getter @Setter @NoArgsConstructor
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "posted_by")
    private User postedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private JobType jobType;

    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Integer experienceRequired;
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    private JobStatus status = JobStatus.PENDING_APPROVAL;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

```java
@Entity
@Table(name = "applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "seeker_id"}))
@Getter @Setter @NoArgsConstructor
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seeker_id")
    private User seeker;

    @ManyToOne(fetch = FetchType.LAZY)
    private Resume resume;

    @Column(columnDefinition = "TEXT")
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @CreationTimestamp
    private LocalDateTime appliedAt;
}
```

### 19.4 DTOs

```java
public record RegisterRequest(
    @NotBlank String fullName,
    @Email @NotBlank String email,
    @Size(min = 8, message = "Password must be at least 8 characters") String password,
    @NotNull Role role   // JOB_SEEKER or RECRUITER only; ADMIN is never self-registered
) {}

public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}

public record AuthResponse(String accessToken, String refreshToken, UserSummary user) {
    public record UserSummary(Long id, String fullName, String email, Role role) {}
}

public record JobRequest(
    @NotBlank @Size(max = 200) String title,
    @NotBlank String description,
    @NotBlank String location,
    @NotNull JobType jobType,
    @PositiveOrZero BigDecimal salaryMin,
    @PositiveOrZero BigDecimal salaryMax,
    Integer experienceRequired,
    Long categoryId,
    @Future LocalDate applicationDeadline
) {}

public record ApplicationRequest(
    @NotNull Long jobId,
    Long resumeId,
    @Size(max = 5000) String coverLetter
) {}

public record JobFilter(
    String keyword, String location, JobType type, Long category,
    BigDecimal minSalary, BigDecimal maxSalary, Integer experience
) {}
```

### 19.5 Security Configuration

```java
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())            // stateless JWT API
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/**", "/api/companies/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasAnyRole("RECRUITER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("JOB_SEEKER")
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }
}
```

### 19.6 JWT Service and Filter

```java
@Service
public class JwtService {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.access-expiry-minutes}") private long accessExpiryMinutes;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(String.valueOf(user.getId()))
            .claim("email", user.getEmail())
            .claim("role", user.getRole().name())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plus(accessExpiryMinutes, ChronoUnit.MINUTES)))
            .signWith(key())
            .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    }
}
```

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(header.substring(7));
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails user = userDetailsService.loadUserById(Long.valueOf(claims.getSubject()));
                    var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (JwtException | IllegalArgumentException ignored) {
                // invalid token: continue unauthenticated; protected endpoints will return 401
            }
        }
        chain.doFilter(req, res);
    }
}
```

### 19.7 Auth Controller and Service

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse.UserSummary> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse.UserSummary register(RegisterRequest req) {
        if (req.role() == Role.ADMIN) throw new AccessDeniedException("Invalid role");
        if (userRepository.existsByEmail(req.email()))
            throw new DuplicateResourceException("Email already registered");

        User user = new User();
        user.setFullName(req.fullName());
        user.setEmail(req.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setRole(req.role());
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return new AuthResponse.UserSummary(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email().toLowerCase(), req.password()));
        User user = userRepository.findByEmail(req.email().toLowerCase()).orElseThrow();
        return new AuthResponse(
            jwtService.generateAccessToken(user),
            refreshTokenService.create(user),
            new AuthResponse.UserSummary(user.getId(), user.getFullName(), user.getEmail(), user.getRole()));
    }
}
```

### 19.8 Job Controller

```java
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public Page<JobResponse> search(JobFilter filter,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return jobService.search(filter, pageable);
    }

    @GetMapping("/{id}")
    public JobResponse get(@PathVariable Long id) {
        return jobService.getById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobRequest req,
                                              @AuthenticationPrincipal AppUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.create(req, principal.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public JobResponse update(@PathVariable Long id, @Valid @RequestBody JobRequest req,
                              @AuthenticationPrincipal AppUserDetails principal) {
        return jobService.update(id, req, principal.getId());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal AppUserDetails principal) {
        jobService.delete(id, principal);
        return ResponseEntity.noContent().build();
    }
}
```

### 19.9 Job Service and Dynamic Filtering

```java
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;

    @Transactional(readOnly = true)
    public Page<JobResponse> search(JobFilter filter, Pageable pageable) {
        return jobRepository.findAll(JobSpecification.from(filter), pageable)
                            .map(jobMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public JobResponse getById(Long id) {
        return jobRepository.findById(id).map(jobMapper::toResponse)
            .orElseThrow(() -> new ResourceNotFoundException("Job " + id + " not found"));
    }

    @Transactional
    public JobResponse create(JobRequest req, Long recruiterId) {
        Company company = companyRepository.findByOwnerId(recruiterId)
            .orElseThrow(() -> new IllegalStateException("Create a company profile first"));
        Job job = jobMapper.toEntity(req);
        job.setCompany(company);
        job.setPostedBy(userRepository.getReferenceById(recruiterId));
        job.setStatus(company.isVerified() ? JobStatus.OPEN : JobStatus.PENDING_APPROVAL);
        return jobMapper.toResponse(jobRepository.save(job));
    }

    @Transactional
    public JobResponse update(Long id, JobRequest req, Long recruiterId) {
        Job job = jobRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job " + id + " not found"));
        if (!job.getPostedBy().getId().equals(recruiterId))
            throw new AccessDeniedException("You do not own this job");
        jobMapper.updateEntity(req, job);
        return jobMapper.toResponse(job);
    }

    @Transactional
    public void delete(Long id, AppUserDetails principal) {
        Job job = jobRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job " + id + " not found"));
        boolean isOwner = job.getPostedBy().getId().equals(principal.getId());
        if (!isOwner && !principal.isAdmin()) throw new AccessDeniedException("Not allowed");
        jobRepository.delete(job);
    }
}
```

```java
public final class JobSpecification {

    private JobSpecification() {}

    public static Specification<Job> from(JobFilter f) {
        return (root, query, cb) -> {
            List<Predicate> p = new ArrayList<>();
            p.add(cb.equal(root.get("status"), JobStatus.OPEN));

            if (StringUtils.hasText(f.keyword())) {
                String like = "%" + f.keyword().toLowerCase() + "%";
                p.add(cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like)));
            }
            if (StringUtils.hasText(f.location()))
                p.add(cb.like(cb.lower(root.get("location")), "%" + f.location().toLowerCase() + "%"));
            if (f.type() != null)
                p.add(cb.equal(root.get("jobType"), f.type()));
            if (f.category() != null)
                p.add(cb.equal(root.get("category").get("id"), f.category()));
            if (f.minSalary() != null)
                p.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), f.minSalary()));
            if (f.maxSalary() != null)
                p.add(cb.lessThanOrEqualTo(root.get("salaryMin"), f.maxSalary()));
            if (f.experience() != null)
                p.add(cb.lessThanOrEqualTo(root.get("experienceRequired"), f.experience()));

            return cb.and(p.toArray(Predicate[]::new));
        };
    }
}
```

`JobRepository` must extend both `JpaRepository<Job, Long>` and `JpaSpecificationExecutor<Job>`.

### 19.10 Application Controller and Service

```java
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest req,
                                                     @AuthenticationPrincipal AppUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                             .body(applicationService.apply(req, principal.getId()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public Page<ApplicationResponse> myApplications(@AuthenticationPrincipal AppUserDetails principal,
                                                    Pageable pageable) {
        return applicationService.findBySeeker(principal.getId(), pageable);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ApplicationResponse updateStatus(@PathVariable Long id,
                                            @RequestBody @Valid StatusUpdateRequest req,
                                            @AuthenticationPrincipal AppUserDetails principal) {
        return applicationService.updateStatus(id, req.status(), principal.getId());
    }
}
```

```java
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final ApplicationMapper mapper;
    private final ApplicationEventPublisher events;

    @Transactional
    public ApplicationResponse apply(ApplicationRequest req, Long seekerId) {
        Job job = jobRepository.findById(req.jobId())
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.OPEN ||
            (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())))
            throw new BusinessException("This job is no longer accepting applications");

        if (applicationRepository.existsByJobIdAndSeekerId(job.getId(), seekerId))
            throw new DuplicateApplicationException("You have already applied to this job");

        Resume resume = null;
        if (req.resumeId() != null) {
            resume = resumeRepository.findByIdAndUserId(req.resumeId(), seekerId)
                .orElseThrow(() -> new AccessDeniedException("Invalid resume"));
        }

        Application app = new Application();
        app.setJob(job);
        app.setSeeker(userRepository.getReferenceById(seekerId));
        app.setResume(resume);
        app.setCoverLetter(req.coverLetter());
        app.setStatus(ApplicationStatus.APPLIED);
        applicationRepository.save(app);

        events.publishEvent(new ApplicationSubmittedEvent(app.getId()));  // async email listener
        return mapper.toResponse(app);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, ApplicationStatus status, Long recruiterId) {
        Application app = applicationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!app.getJob().getPostedBy().getId().equals(recruiterId))
            throw new AccessDeniedException("Not your job");
        app.setStatus(status);
        events.publishEvent(new ApplicationStatusChangedEvent(app.getId(), status));
        return mapper.toResponse(app);
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponse> findBySeeker(Long seekerId, Pageable pageable) {
        return applicationRepository.findBySeekerId(seekerId, pageable).map(mapper::toResponse);
    }
}
```

### 19.11 Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> notFound(ResourceNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    @ExceptionHandler({DuplicateApplicationException.class, DuplicateResourceException.class})
    public ResponseEntity<ApiError> conflict(RuntimeException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> forbidden(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "Access denied", null);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> badCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Invalid email or password", null);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return build(HttpStatus.BAD_REQUEST, "Validation failed", errors);
    }

    private ResponseEntity<ApiError> build(HttpStatus status, String msg, Map<String, String> details) {
        return ResponseEntity.status(status)
            .body(new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), msg, details));
    }

    public record ApiError(Instant timestamp, int status, String error, String message,
                           Map<String, String> details) {}
}
```

### 19.12 CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origin}") String origin) {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of(origin));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        cfg.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/api/**", cfg);
        return src;
    }
}
```

---

## 20. Example JSON APIs

### 20.1 Register

`POST /api/auth/register`

```json
{
  "fullName": "Asha Patil",
  "email": "asha@example.com",
  "password": "StrongPass#123",
  "role": "JOB_SEEKER"
}
```

`201 Created`

```json
{
  "id": 101,
  "fullName": "Asha Patil",
  "email": "asha@example.com",
  "role": "JOB_SEEKER"
}
```

### 20.2 Login

`POST /api/auth/login`

```json
{ "email": "asha@example.com", "password": "StrongPass#123" }
```

`200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "d1f4c2a8-9b7e-4c1d-a7f0-2b1e5d9c3a44",
  "user": { "id": 101, "fullName": "Asha Patil", "email": "asha@example.com", "role": "JOB_SEEKER" }
}
```

### 20.3 Create Job (Recruiter)

`POST /api/jobs`  ·  `Authorization: Bearer <JWT>`

```json
{
  "title": "Senior Java Developer",
  "description": "Build and maintain Spring Boot microservices...",
  "location": "Mumbai, Maharashtra",
  "jobType": "FULL_TIME",
  "salaryMin": 1200000,
  "salaryMax": 2000000,
  "experienceRequired": 5,
  "categoryId": 3,
  "applicationDeadline": "2026-12-31"
}
```

`201 Created`

```json
{
  "id": 55,
  "title": "Senior Java Developer",
  "location": "Mumbai, Maharashtra",
  "jobType": "FULL_TIME",
  "salaryMin": 1200000,
  "salaryMax": 2000000,
  "experienceRequired": 5,
  "status": "PENDING_APPROVAL",
  "company": { "id": 7, "name": "TechNova Pvt Ltd", "logoUrl": "/files/logos/7.png" },
  "createdAt": "2026-10-03T10:15:30Z"
}
```

### 20.4 Search Jobs

`GET /api/jobs?keyword=java&location=Mumbai&type=FULL_TIME&page=0&size=2`

`200 OK`

```json
{
  "content": [
    {
      "id": 55,
      "title": "Senior Java Developer",
      "location": "Mumbai, Maharashtra",
      "jobType": "FULL_TIME",
      "salaryMin": 1200000,
      "salaryMax": 2000000,
      "company": { "id": 7, "name": "TechNova Pvt Ltd" },
      "createdAt": "2026-10-03T10:15:30Z"
    },
    {
      "id": 48,
      "title": "Java Backend Engineer",
      "location": "Navi Mumbai",
      "jobType": "FULL_TIME",
      "salaryMin": 800000,
      "salaryMax": 1400000,
      "company": { "id": 12, "name": "FinServe Labs" },
      "createdAt": "2026-10-01T08:00:00Z"
    }
  ],
  "page": 0,
  "size": 2,
  "totalElements": 37,
  "totalPages": 19
}
```

### 20.5 Apply for a Job

`POST /api/applications`  ·  `Authorization: Bearer <JWT>`

```json
{ "jobId": 55, "resumeId": 9, "coverLetter": "I have 6 years of Java experience..." }
```

`201 Created`

```json
{
  "id": 3001,
  "jobId": 55,
  "jobTitle": "Senior Java Developer",
  "companyName": "TechNova Pvt Ltd",
  "status": "APPLIED",
  "appliedAt": "2026-10-03T11:02:44Z"
}
```

### 20.6 Update Application Status (Recruiter)

`PATCH /api/applications/3001/status`

```json
{ "status": "SHORTLISTED" }
```

### 20.7 Error Responses

`409 Conflict` (duplicate application)

```json
{
  "timestamp": "2026-10-03T11:05:10Z",
  "status": 409,
  "error": "Conflict",
  "message": "You have already applied to this job",
  "details": null
}
```

`400 Bad Request` (validation)

```json
{
  "timestamp": "2026-10-03T11:06:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": { "title": "must not be blank", "applicationDeadline": "must be a future date" }
}
```

---

## 21. Database Tables (DDL)

PostgreSQL syntax is shown. For MySQL, replace `BIGSERIAL` with `BIGINT AUTO_INCREMENT`, `TIMESTAMP` defaults with `CURRENT_TIMESTAMP`, and `BOOLEAN` with `TINYINT(1)`.

```sql
-- V1__init_schema.sql

CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY,
    full_name      VARCHAR(120)  NOT NULL,
    email          VARCHAR(180)  NOT NULL UNIQUE,
    password_hash  VARCHAR(100)  NOT NULL,
    phone          VARCHAR(20),
    role           VARCHAR(20)   NOT NULL CHECK (role IN ('JOB_SEEKER','RECRUITER','ADMIN')),
    status         VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','BLOCKED','PENDING_VERIFICATION')),
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id           BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    headline          VARCHAR(200),
    summary           TEXT,
    skills            TEXT,                 -- comma separated or JSON
    experience_years  INT,
    current_location  VARCHAR(120),
    expected_salary   NUMERIC(12,2)
);

CREATE TABLE resumes (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name   VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    uploaded_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT       NOT NULL REFERENCES users(id),
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    website     VARCHAR(255),
    industry    VARCHAR(120),
    location    VARCHAR(150),
    logo_url    VARCHAR(500),
    verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    id                    BIGSERIAL PRIMARY KEY,
    company_id            BIGINT       NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    posted_by             BIGINT       NOT NULL REFERENCES users(id),
    category_id           BIGINT       REFERENCES categories(id),
    title                 VARCHAR(200) NOT NULL,
    description           TEXT         NOT NULL,
    location              VARCHAR(150),
    job_type              VARCHAR(20)  NOT NULL CHECK (job_type IN ('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP','REMOTE')),
    salary_min            NUMERIC(12,2),
    salary_max            NUMERIC(12,2),
    experience_required   INT,
    application_deadline  DATE,
    status                VARCHAR(25)  NOT NULL DEFAULT 'PENDING_APPROVAL'
                          CHECK (status IN ('DRAFT','PENDING_APPROVAL','OPEN','CLOSED','REJECTED','EXPIRED')),
    created_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id            BIGSERIAL PRIMARY KEY,
    job_id        BIGINT      NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    seeker_id     BIGINT      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id     BIGINT      REFERENCES resumes(id) ON DELETE SET NULL,
    cover_letter  TEXT,
    status        VARCHAR(20) NOT NULL DEFAULT 'APPLIED'
                  CHECK (status IN ('APPLIED','REVIEWED','SHORTLISTED','INTERVIEW','OFFERED','REJECTED','WITHDRAWN')),
    applied_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_application UNIQUE (job_id, seeker_id)
);

CREATE TABLE saved_jobs (
    user_id   BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id    BIGINT    NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
    saved_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
);

CREATE TABLE refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(128) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message     VARCHAR(500) NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_jobs_status_created ON jobs (status, created_at DESC);
CREATE INDEX idx_jobs_location       ON jobs (location);
CREATE INDEX idx_jobs_category       ON jobs (category_id);
CREATE INDEX idx_jobs_type           ON jobs (job_type);
CREATE INDEX idx_jobs_company        ON jobs (company_id);
CREATE INDEX idx_apps_job            ON applications (job_id);
CREATE INDEX idx_apps_seeker         ON applications (seeker_id);

-- PostgreSQL full-text search (MySQL: CREATE FULLTEXT INDEX ft_jobs ON jobs(title, description);)
CREATE INDEX idx_jobs_fts ON jobs USING GIN (to_tsvector('english', title || ' ' || description));
```

### 21.1 Table Summary

| Table | Purpose |
|-------|---------|
| `users` | Accounts for all roles |
| `user_profiles` | Extended seeker profile |
| `resumes` | Uploaded resume metadata |
| `companies` | Employer organizations |
| `categories` | Job categories (IT, Finance, ...) |
| `jobs` | Job postings |
| `applications` | Seeker applications to jobs |
| `saved_jobs` | Bookmarks |
| `refresh_tokens` | Session renewal and revocation |
| `notifications` | In-app notifications |

---

## 22. Deployment Architecture

### 22.1 Production Topology

```text
                          Internet Users
                                │
                                ▼
                     DNS (jobportal.example.com)
                                │
                                ▼
                    CDN / WAF  (static assets, DDoS)
                                │
                                ▼
                 Load Balancer / Reverse Proxy (Nginx)
                    HTTPS termination (TLS cert)
                   │                           │
        ┌──────────┘                           └──────────┐
        ▼                                                 ▼
 Static hosting / Nginx                       Backend instances (stateless)
 React build (dist/)                          ┌───────────┐ ┌───────────┐
 served at  /                                 │ Spring    │ │ Spring    │ ...
                                              │ Boot #1   │ │ Boot #2   │
                                              └─────┬─────┘ └─────┬─────┘
                                                    └──────┬──────┘
                                                           │
                           ┌───────────────────────────────┼─────────────────────┐
                           ▼                               ▼                     ▼
                  PostgreSQL / MySQL              Object Storage          SMTP / Email
                  Primary + Read Replica          (resumes, logos)        service
                  (automated backups)             S3-compatible
                           │
                           ▼
                 Monitoring & Logging: Prometheus · Grafana · ELK / Loki
```

### 22.2 Environments

| Environment | Purpose | Notes |
|-------------|---------|-------|
| Local | Development | Docker Compose, hot reload |
| Staging | QA / UAT | Production-like, test data |
| Production | Live | HA, backups, monitoring |

### 22.3 Backend Dockerfile (`backend/Dockerfile`)

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 22.4 Frontend Dockerfile (`frontend/Dockerfile`)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### 22.5 Nginx Config (`docker/nginx.conf`)

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # React Router: fall back to index.html
  location / {
    try_files $uri /index.html;
  }

  # Proxy API calls to the backend
  location /api/ {
    proxy_pass http://backend:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 6M;
  }
}
```

### 22.6 Docker Compose (`docker-compose.yml`)

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: jobportal
      POSTGRES_USER: jobportal
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jobportal"]
      interval: 10s
      retries: 5

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/jobportal
      DB_USER: jobportal
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: http://localhost
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      args:
        VITE_API_BASE_URL: /api
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### 22.7 CI/CD Pipeline

```text
Developer push / PR
      │
      ▼
GitHub Actions
  ├─ Backend : mvn verify (unit + integration tests with Testcontainers)
  ├─ Frontend: npm ci → lint → test → build
  ├─ Security: dependency scan (OWASP / npm audit), image scan
  ├─ Build & push Docker images to registry
  └─ Deploy
        ├─ develop branch → Staging (auto)
        └─ main branch    → Production (manual approval, rolling update)
```

### 22.8 Operational Considerations

- Run Flyway migrations automatically at startup (or as a pre-deploy step).
- Expose `/actuator/health` for load balancer health checks.
- Store secrets (DB password, JWT secret) in a secret manager, never in Git.
- Daily automated DB backups with periodic restore tests.
- Centralized structured logging with request IDs; alert on error rate and latency.

---

## 23. Conclusion and Future Enhancements

### 23.1 Conclusion

This Job Portal uses a clean, layered architecture. A **React.js** single-page frontend communicates with a **Spring Boot** backend over **REST + JSON**, secured by **JWT** and role-based access control, and persists data in a **relational database** (PostgreSQL or MySQL). The design separates concerns clearly (controllers, services, repositories), supports three distinct user roles with dedicated workflows, scales horizontally because the backend is stateless, and can be deployed consistently using Docker and a CI/CD pipeline.

### 23.2 Future Enhancements

| Area | Enhancement |
|------|-------------|
| Search | Elasticsearch/OpenSearch for relevance ranking, typo tolerance, facets |
| Recommendations | Job-to-candidate matching using skills and ML-based ranking |
| Resume | Resume parsing (skills/experience extraction), ATS scoring |
| Communication | In-app chat, interview scheduling with calendar integration |
| Notifications | Real-time via WebSockets/SSE, push notifications, job alerts by saved search |
| Auth | OAuth2 social login (Google, LinkedIn), 2FA, email verification |
| Employer tools | Subscription plans, featured listings, payment gateway integration |
| Analytics | Recruiter funnel analytics, admin BI dashboards |
| Architecture | Move to microservices (auth, jobs, applications, notifications), message broker (Kafka/RabbitMQ), Redis caching |
| Mobile | React Native app reusing the same REST API |
| Quality | Contract testing, load testing, accessibility (WCAG) and i18n |
| Compliance | GDPR-style data export/deletion, audit logs |

---

*End of document.*
