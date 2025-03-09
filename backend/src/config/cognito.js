const AWS = require("aws-sdk");
require("dotenv").config();  // ✅ Dodaj učitavanje .env varijabli

// Inicijalizacija Cognito klijenta
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports = cognito;
