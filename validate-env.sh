#!/bin/bash

echo "🔍 Validating backend/.env..."

ENV_PATH="./backend/.env"

REQUIRED_BACKEND_KEYS=(
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
  REGION
  COGNITO_USER_POOL_ID
  COGNITO_CLIENT_ID
  CORS_ORIGIN
  USERS_TABLE
  NOTIFICATIONS_TABLE
  RESERVATIONS_TABLE
  MESSAGES_TABLE
)

missing=0

for key in "${REQUIRED_BACKEND_KEYS[@]}"; do
  if ! grep -q "^$key=" "$ENV_PATH"; then
    echo "❌ Missing backend env key: $key"
    missing=1
  fi
done

echo "🔍 Validating frontend/.env..."

ENV_PATH="./frontend/.env"

REQUIRED_FRONTEND_KEYS=(
  REACT_APP_API_URL
)

for key in "${REQUIRED_FRONTEND_KEYS[@]}"; do
  if ! grep -q "^$key=" "$ENV_PATH"; then
    echo "❌ Missing frontend env key: $key"
    missing=1
  fi
done

if [ $missing -eq 1 ]; then
  echo "🚫 One or more .env keys are missing."
  exit 1
else
  echo "✅ All .env files are valid."
fi
