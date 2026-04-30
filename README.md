# EventSphere - Event Management System

A full-stack Event Management System aligned with the project proposal: Spring Boot REST APIs, Spring Security with JWT, MySQL persistence through JPA/Hibernate, Swagger documentation, and a responsive React frontend.

## Project Structure

```text
event-management-system/
├── backend/                 Spring Boot backend
│   ├── src/main/java/com/events/
│   │   ├── config/          Security, Swagger, data initialization
│   │   ├── controller/      REST API controllers
│   │   ├── dto/             Request and response objects
│   │   ├── exception/       Global exception handling
│   │   ├── filter/          JWT and request logging filters
│   │   ├── model/           JPA entities
│   │   ├── repository/      Spring Data JPA repositories
│   │   ├── service/         Business logic and transactions
│   │   └── util/            JWT utility
├── frontend/                Vite + React frontend
│   ├── src/api/             Axios API client
│   ├── src/components/      Reusable UI components
│   ├── src/context/         Authentication state
│   ├── src/pages/           Application pages
│   └── src/index.css        Responsive design system
└── EventSphere-API.postman_collection.json
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Spring Boot 3.2, Java 21 |
| Security | Spring Security, JWT, BCrypt |
| Database | MySQL, Hibernate/JPA |
| API Docs | Swagger/OpenAPI via SpringDoc |
| Frontend | React 18, Vite, React Router |
| API Client | Axios, TanStack Query |
| Forms/UI | React Hook Form, Lucide React icons |

## Core Features

- Validated user registration and secure JWT login.
- Role-based authorization for `ADMIN` and `USER`.
- Admin-only event creation, update, and deletion.
- Event listing with pagination, search, date, category, and availability filters.
- User event registration with duplicate prevention and atomic capacity checks.
- Attendance tracking for admins.
- Global exception handling with consistent API responses.
- Swagger UI at `http://localhost:8080/swagger-ui.html`.
- Responsive, polished React UI with icon-based controls.

## Quick Start

### 1. Prepare MySQL

Create a MySQL database user or use your local root user. The backend can create the database automatically if the user has permission.

Default database URL:

```text
jdbc:mysql://localhost:3306/eventdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
```

### 2. Start Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bat
cd backend
mvnw.cmd spring-boot:run
```

Optional environment variables:

```text
MYSQL_URL=jdbc:mysql://localhost:3306/eventdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
MYSQL_USER=root
MYSQL_PASSWORD=your_password
JWT_SECRET=base64_encoded_256_bit_secret
JWT_EXPIRATION=86400000
ADMIN_EMAIL=admin@eventsphere.com
ADMIN_PASSWORD=Admin@1234
```

The seeded admin account is approved automatically. Regular self-registration creates a `USER` account.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

## API Overview

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
GET    /api/events
GET    /api/events/{id}
POST   /api/events                 ADMIN
PUT    /api/events/{id}            ADMIN
DELETE /api/events/{id}            ADMIN
POST   /api/registrations
GET    /api/registrations/my
DELETE /api/registrations/{id}
PUT    /api/attendance/{id}        ADMIN
GET    /api/attendance/event/{id}/registrants  ADMIN
GET    /api/attendance/event/{id}/attendees    ADMIN
```

## Verification

Backend:

```bash
cd backend
./mvnw test
```

Frontend:

```bash
cd frontend
npm run build
```
