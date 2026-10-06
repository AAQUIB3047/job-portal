-- V1__init_schema.sql
-- Job Portal Application Database Schema

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS user_profiles (
    user_id           BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    headline          VARCHAR(200),
    summary           TEXT,
    skills            TEXT,                 -- comma separated
    experience_years  INT,
    current_location  VARCHAR(120),
    expected_salary   NUMERIC(12,2)
);

CREATE TABLE IF NOT EXISTS resumes (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name    VARCHAR(255) NOT NULL,
    file_path    VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    uploaded_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
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

CREATE TABLE IF NOT EXISTS categories (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS jobs (
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

CREATE TABLE IF NOT EXISTS applications (
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

CREATE TABLE IF NOT EXISTS saved_jobs (
    user_id   BIGINT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id    BIGINT    NOT NULL REFERENCES jobs(id)  ON DELETE CASCADE,
    saved_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(128) NOT NULL UNIQUE,
    expires_at  TIMESTAMP    NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message     VARCHAR(500) NOT NULL,
    is_read     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON jobs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_location       ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_category       ON jobs (category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type           ON jobs (job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_company        ON jobs (company_id);
CREATE INDEX IF NOT EXISTS idx_apps_job            ON applications (job_id);
CREATE INDEX IF NOT EXISTS idx_apps_seeker         ON applications (seeker_id);
