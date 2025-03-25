// scripts/validateEnv.js

const fs = require("fs");
const dotenv = require("dotenv");

const folders = ["backend", "frontend"];
const envVariants = [".env", ".env.dev", ".env.test", ".env.prod"];

const requiredVars = {
  backend: [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "REGION",
    "COGNITO_USER_POOL_ID",
    "COGNITO_CLIENT_ID",
    "CORS_ORIGIN",
    "USERS_TABLE",
    "NOTIFICATIONS_TABLE",
    "RESERVATIONS_TABLE",
    "MESSAGES_TABLE",
  ],
  frontend: ["REACT_APP_API_URL"],
};

let error = false;

folders.forEach((folder) => {
  envVariants.forEach((fileName) => {
    const filePath = `${folder}/${fileName}`;
    if (fs.existsSync(filePath)) {
      console.log(`🔍 Validating ${filePath}...`);
      const envConfig = dotenv.parse(fs.readFileSync(filePath));
      const missing = requiredVars[folder].filter((key) => !envConfig[key]);

      if (missing.length > 0) {
        console.error(`❌ ${fileName} in ${folder} is missing keys: ${missing.join(", ")}`);
        error = true;
      }
    }
  });
});

if (error) {
  console.error("❌ Some .env files are invalid.");
  process.exit(1);
} else {
  console.log("✅ All .env.* files are valid.");
}
