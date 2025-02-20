#!/bin/bash

# Wait for the database to be ready
until nc -z -v -w30 db 5432; do
  echo "Waiting for database connection..."
  sleep 1
done
# Run Prisma migrations
npx prisma migrate deploy

# Start the application
node dist/main
