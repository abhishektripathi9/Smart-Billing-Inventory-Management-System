@echo off
title smartBiz - Backend Server (Spring Boot 3 + Java)
echo ========================================================
echo  smartBiz - Smart Billing & Inventory Management System
echo  Starting Spring Boot REST API Backend on http://localhost:8080
echo ========================================================
cd /d "%~dp0backend"

:: Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Found Maven in PATH. Starting Spring Boot...
    mvn spring-boot:run
) else (
    echo [NOTICE] Maven CLI not found in PATH.
    echo To run the Spring Boot backend:
    echo  1. Open IntelliJ IDEA, Eclipse, or VS Code.
    echo  2. Open the 'backend' folder as a Maven project.
    echo  3. Run com.smartbilling.SmartBillingApplication.java
    echo.
    echo The React frontend will run seamlessly in interactive demo mode
    echo with full localStorage persistence and GST calculation!
    pause
)

