@echo off
setlocal
cd /d "%~dp0"

start "Memory Studio Server" cmd /k "npm.cmd run studio"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4317/studio"

endlocal
