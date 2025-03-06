const AWS = require("aws-sdk");

// Inicijalizacija Cognito klijenta
const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports = cognito;
