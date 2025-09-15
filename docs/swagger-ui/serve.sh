#!/bin/bash

# Swagger UI用簡易HTTPサーバー起動スクリプト

PORT=${1:-8080}
echo "==================================="
echo "SiteWatcher2 API Documentation"
echo "==================================="
echo "Starting HTTP server on port $PORT..."
echo "Access URL: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo "==================================="

# Pythonが利用可能かチェック
if command -v python3 &> /dev/null; then
    echo "Using improved Python 3 server (YAML + CORS support)..."
    python3 server.py $PORT
elif command -v python &> /dev/null; then
    echo "Using Python 2..."
    python -m SimpleHTTPServer $PORT
elif command -v php &> /dev/null; then
    echo "Using PHP..."
    php -S localhost:$PORT
elif command -v npx &> /dev/null; then
    echo "Using Node.js..."
    npx http-server -p $PORT
else
    echo "Error: No suitable HTTP server found."
    echo "Please install one of the following:"
    echo "  - Python 3 (recommended)"
    echo "  - Python 2"
    echo "  - PHP"
    echo "  - Node.js with npx"
    exit 1
fi
