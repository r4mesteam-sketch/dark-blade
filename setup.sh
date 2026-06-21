#!/bin/bash

# Dark Blade Development Setup

echo "🔧 Setting up Dark Blade for development..."

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Frontend setup  
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

# Generate Prisma client
echo ""
echo "🗄️  Generating Prisma Client..."
cd ../backend
npx prisma generate
echo "✅ Prisma Client generated"

echo ""
echo "✅ Development setup complete!"
echo ""
echo "To start development:"
echo "  1. cd backend && npm run start:dev"
echo "  2. cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up -d"
