@echo off
title smartBiz - Frontend Server (React + Vite)
echo ========================================================
echo  smartBiz - Smart Billing & Inventory Management System
echo  Starting React.js Frontend on http://localhost:5173
echo ========================================================
cd /d "%~dp0"
node "frontend\node_modules\vite\bin\vite.js" frontend --host 0.0.0.0 --port 5173
pause

