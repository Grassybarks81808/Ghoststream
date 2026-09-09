@echo off
title Ghoststream - Free Movies, Zero Ads
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
echo.
echo Ghoststream stopped.
pause
