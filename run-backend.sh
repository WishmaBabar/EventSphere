#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Configuration Defaults (used if not set in .env)
export MYSQL_URL=${MYSQL_URL:-"jdbc:mysql://localhost:3306/eventdb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"}
export MYSQL_USER=${MYSQL_USER:-"root"}
export JWT_SECRET=${JWT_SECRET:-"4e635266556a586e3272357538782f413f4428472b4b6250655368566d597133"}
export JWT_EXPIRATION=${JWT_EXPIRATION:-"86400000"}

echo "--- EventSphere Backend Runner ---"
echo "Cleaning up port 8080..."
lsof -i :8080 -t | xargs kill -9 2>/dev/null || true
echo "MySQL URL: $MYSQL_URL"
echo "Java Version: $(java -version 2>&1 | head -n 1)"
echo "----------------------------------"

cd backend
./mvnw spring-boot:run
