# Setup Guide

## Prerequisites

| Tool | Version |
| --- | --- |
| Java JDK | 21 recommended |
| Node.js | 18 or newer |
| MySQL | 8.x recommended |

## Backend

Start MySQL, then run:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bat
cd backend
mvnw.cmd spring-boot:run
```

Default backend URL:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui.html
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Default Admin

```text
Email: admin@eventsphere.com
Password: Admin@1234
```

The backend prepares this admin account on startup using the configured `ADMIN_EMAIL` and `ADMIN_PASSWORD` values.
