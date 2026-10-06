# Job Portal Application

Full-stack Job Portal Web Application built with **React.js 19 + Vite**, **Java 17 Spring Boot 3**, **Spring Security (JWT)**, **Flyway Database Migrations**, and **PostgreSQL / MySQL**.

---

## 🌟 Tech Stack

- **Frontend**: React 19, React Router v7, Axios, Tailwind CSS v4, Lucide React
- **Backend**: Java 17, Spring Boot 3, Spring Web, Spring Data JPA, Spring Security, JWT (jjwt)
- **Database**: PostgreSQL 16 / MySQL 8, Flyway Migrations
- **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions CI/CD

---

## 📁 Directory Structure

```text
JOB PORTAL/
├── Job_Portal_Documentation.md  # Comprehensive technical specification document
├── docker-compose.yml           # Multi-container orchestrator
├── docker/                      # Container Dockerfiles and Nginx configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── backend/                     # Spring Boot Java Application
│   ├── pom.xml
│   └── src/main/java/com/jobportal/
│       ├── controller/          # REST Endpoints (Auth, Users, Companies, Jobs, Applications, Admin)
│       ├── service/             # Business Logic & Service layer
│       ├── entity/              # JPA Domain Entities
│       ├── repository/          # Spring Data JPA Repositories
│       ├── security/            # JWT Filter, AuthenticationManager, SecurityConfig
│       ├── dto/                 # Request & Response Data Transfer Objects
│       └── specification/      # Dynamic JPA Search Specifications
└── frontend/                    # Vite + React 19 Frontend App
    ├── package.json
    └── src/
        ├── api/                 # Axios client API modules
        ├── components/          # Reusable UI Components & Layouts
        ├── context/             # AuthContext state management
        ├── pages/               # Public, Seeker, Recruiter, Admin pages
        └── routes/              # AppRoutes & Role-based ProtectedRoute
```

---

## 🚀 Getting Started

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432` with database `jobportal` (or update `backend/src/main/resources/application.yml`).

### 2. Backend Startup
```bash
cd backend
mvn spring-boot:run
```
Swagger API Documentation will be available at: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Startup
```bash
cd frontend
npm install
npm run dev
```
Access the application at: `http://localhost:5173`

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
This builds and launches PostgreSQL, Spring Boot backend, and Nginx frontend in containerized isolation.
