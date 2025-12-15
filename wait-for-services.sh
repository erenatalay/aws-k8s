#!/bin/bash

echo "⏳ Waiting for auth-api to be ready..."
until curl -f http://localhost:3001/api/health > /dev/null 2>&1; do
  echo "   Auth-api is not ready yet, waiting..."
  sleep 2
done
echo "✅ Auth-api is ready!"

echo "⏳ Waiting for product-api to be ready..."
until curl -f http://localhost:3002/api/health > /dev/null 2>&1; do
  echo "   Product-api is not ready yet, waiting..."
  sleep 2
done
echo "✅ Product-api is ready!"

echo "🚀 All services are ready! Starting gateway..."
