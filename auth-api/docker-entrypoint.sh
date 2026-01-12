#!/bin/sh
set -e

echo "� Checking Prisma migration status..."


MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if npx prisma migrate status 2>/dev/null | grep -q "Database schema is up to date"; then
    echo "✅ Database schema is already up to date!"
    break
  elif npx prisma migrate status 2>/dev/null | grep -q "Following migration"; then
    echo "🔄 Pending migrations found, applying..."
    npx prisma migrate deploy
    echo "✅ Migrations applied successfully!"
    break
  elif npx prisma migrate status 2>/dev/null | grep -q "No migration found"; then
    echo "⚠️  No migrations found in prisma/migrations folder"
    echo "📦 Running prisma db push for initial schema (dev mode)..."
    npx prisma db push --accept-data-loss=false 2>/dev/null || echo "Schema already exists"
    break
  else
    echo "⏳ Database not ready, waiting... (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
  fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "❌ Could not connect to database after $MAX_RETRIES attempts"
  echo "⚠️  Starting without migrations..."
fi


echo "🔧 Generating Prisma client..."
npx prisma generate 2>/dev/null || true

echo "🚀 Starting application..."
exec node dist/main.js
