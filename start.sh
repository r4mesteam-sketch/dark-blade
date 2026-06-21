#!/bin/bash

# Dark Blade Quick Start Script

echo "🚀 Starting Dark Blade Marketplace..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

echo "✅ Docker found"

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please configure .env file before deploying to production"
fi

# Start services
echo "🐳 Starting Docker Compose..."
docker-compose up -d

echo ""
echo "✅ Dark Blade is starting!"
echo ""
echo "📍 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:3001"
echo "   Docs:     http://localhost:3001/api/docs"
echo ""
echo "📊 Database:"
echo "   Host:     localhost:5432"
echo "   Database: dark_blade_db"
echo "   User:     darkblade_user"
echo ""
echo "💾 Redis:"
echo "   Host:     localhost:6379"
echo ""
echo "⏳ Services will be ready in 30 seconds..."
echo ""
echo "Run 'docker-compose logs -f' to see logs"
echo "Run 'docker-compose down' to stop services"
