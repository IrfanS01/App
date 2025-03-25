#!/bin/bash

declare -A descriptions=(
  [AWS_ACCESS_KEY_ID]="🔑 AWS access key ID"
  [AWS_SECRET_ACCESS_KEY]="🔐 AWS secret access key"
  [REGION]="🌍 AWS region, npr. eu-north-1"
  [COGNITO_USER_POOL_ID]="👤 Cognito User Pool ID"
  [COGNITO_CLIENT_ID]="🧠 Cognito App Client ID"
  [CORS_ORIGIN]="🌐 Dozvoljeni frontend origin (http://localhost:3000)"
  [USERS_TABLE]="📋 DynamoDB tabela za korisnike"
  [NOTIFICATIONS_TABLE]="📢 DynamoDB tabela za obavijesti"
  [RESERVATIONS_TABLE]="📅 DynamoDB tabela za rezervacije"
  [MESSAGES_TABLE]="💬 DynamoDB tabela za poruke"
  [REACT_APP_API_URL]="🌐 API endpoint za frontend"
)

for folder in backend frontend; do
  ENV_FILE="$folder/.env.dev"
  OUT_FILE="$folder/.env.example"

  if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️ $ENV_FILE ne postoji, preskačem..."
    continue
  fi

  echo "# 📝 Auto-generated .env.example for $folder" > "$OUT_FILE"
  echo "" >> "$OUT_FILE"

  while read -r line; do
    key=$(echo "$line" | cut -d= -f1)
    desc=${descriptions[$key]}
    if [[ $key ]]; then
      [ "$desc" ] && echo "# $desc" >> "$OUT_FILE"
      echo "$key=" >> "$OUT_FILE"
      echo "" >> "$OUT_FILE"
    fi
  done < <(grep -v '^#' "$ENV_FILE")
done

echo "✅ .env.example files generated."
