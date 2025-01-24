@echo off
start cmd /k "cd /d %~dp0admin-panel && npm run dev"
start cmd /k "cd /d %~dp0client && npm run dev"
