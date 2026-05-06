#!/bin/bash
# Quick Start Script for Expense Tracker
# Run this to set up and start both backend and frontend

echo "🚀 Expense Tracker - Quick Start"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up backend..."
cd backend || exit 1
echo "   Installing backend dependencies..."
npm install --quiet

if [ ! -d "node_modules" ]; then
    echo "❌ Backend setup failed"
    exit 1
fi
echo "✅ Backend ready"
cd .. || exit 1
echo ""

# Frontend Setup
echo "📦 Setting up frontend..."
cd expense-tracker || exit 1
echo "   Installing frontend dependencies..."
npm install --quiet

if [ ! -d "node_modules" ]; then
    echo "❌ Frontend setup failed"
    exit 1
fi
echo "✅ Frontend ready"
cd .. || exit 1
echo ""

# Configuration
echo "⚙️  Configuration"
echo "   Backend URL in expense-tracker/src/config/backend.ts:"
echo "   - Android emulator: http://10.0.2.2:3001"
echo "   - Physical phone: http://YOUR_PC_IP:3001"
echo ""

# Ready to start
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Terminal 1 - Start backend:"
echo "      cd backend && npm run dev"
echo ""
echo "   2. Terminal 2 - Start frontend:"
echo "      cd expense-tracker && npm start"
echo ""
echo "   3. In the app - Settings > Cloud sync"
echo "      Enter your backend URL and save"
echo ""
echo "✨ Auto-sync will start automatically when online!"
