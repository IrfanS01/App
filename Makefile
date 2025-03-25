# 📁 Makefile — u root App01 direktoriju

# Globalne promjenjive
FRONTEND=frontend
BACKEND=backend

# ✅ Validacija .env fajlova
envcheck:
	@echo "🔍 Validating .env files..."
	@npm run validate-env

# ✅ Generisanje .env.example
envexample:
	@echo "📄 Generating .env.example files..."
	@npm run generate-env-example

# 🚀 Deploy backend na AWS
deploy:
	cd $(BACKEND) && npx serverless deploy

# 🧪 Pokretanje serverless offline (lokalni backend)
offline:
	cd $(BACKEND) && npx serverless offline

# 🔁 Pokretanje React frontenda
dev:
	cd $(FRONTEND) && npm run dev

# 🧹 Cleanup .serverless
clean:
	cd $(BACKEND) && rm -rf .serverless
# 📦 Instaliraj sve dependencies za frontend i backend
setup:
	cd backend && npm install
	cd frontend && npm install
