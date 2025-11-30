#!/bin/bash

# Test backend connectivity
echo "Testing Notezilla Backend Connectivity..."
echo "=========================================="
echo ""

# Test health endpoint
echo "1. Testing health check endpoint..."
curl -v https://notezilla-backend-k5tp.onrender.com/health
echo ""
echo ""

# Test API health
echo "2. Testing API health check..."
curl -v https://notezilla-backend-k5tp.onrender.com/api/health
echo ""
echo ""

# Test CORS preflight
echo "3. Testing CORS with OPTIONS request..."
curl -X OPTIONS -v \
  -H "Origin: https://notezilla-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  https://notezilla-backend-k5tp.onrender.com/api/auth/login
echo ""
echo ""

echo "Test complete!"
