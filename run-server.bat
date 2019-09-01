@echo off
REM This script runs a simple static file server for testing purposes
REM Access as e.g. http://localhost:8000/display-parameter.html?q=abc

REM Install dependency
rem npm install -g node-static

REM Run server to serve the docs subdirectory
static -p 8000 docs
