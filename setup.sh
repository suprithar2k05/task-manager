#!/bin/bash

# Setup script for Task Manager App (Monorepo)

# Exit immediately if a command exits with a non-zero status
set -e

echo "Installing backend dependencies..."
cd server
npm install

if [ ! -f ".env" ]; then
  echo "⚠️  No backend .env file found. Creating a template..."
  cat <<EOT >> .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EOT
  echo "Backend .env created (please edit it with real credentials)"
fi

echo "Starting backend server..."
npm run start &

cd ..

echo "Installing frontend dependencies..."
cd client
npm install

if [ ! -f ".env" ]; then
  echo "No frontend .env file found. Creating a template..."
  cat <<EOT >> .env
VITE_API_BASE_URL=http://localhost:5000/api
EOT
  echo "Frontend .env created"
fi

echo "Starting frontend server..."
npm run dev &

echo "Both frontend and backend are starting..."
echo "Open http://localhost:5173 in your browser"
