const AWS = require("aws-sdk");

// Inicijalizacija DynamoDB DocumentClient-a
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
