@echo off
setlocal enabledelayedexpansion

echo --- EventSphere Backend Runner (Windows) ---

:: Load .env file
if exist .env (
    echo Loading environment variables from .env...
    for /f "tokens=*" %%a in ('findstr /v "^#" .env') do (
        set line=%%a
        for /f "tokens=1,2 delims==" %%b in ("!line!") do (
            set "%%b=%%c"
        )
    )
)

:: Set Defaults if not in .env
if "%MYSQL_URL%"=="" set MYSQL_URL=jdbc:mysql://localhost:3306/eventdb?createDatabaseIfNotExist=true^&useSSL=false^&serverTimezone=UTC
if "%MYSQL_USER%"=="" set MYSQL_USER=root
if "%JWT_SECRET%"=="" set JWT_SECRET=4e635266556a586e3272357538782f413f4428472b4b6250655368566d597133
if "%JWT_EXPIRATION%"=="" set JWT_EXPIRATION=86400000

echo MySQL URL: %MYSQL_URL%
java -version
echo ------------------------------------------

cd backend
call mvnw.cmd spring-boot:run
pause
