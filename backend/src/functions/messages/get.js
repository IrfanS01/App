// src/functions/messages/get.js
const dynamoDB = require("../../config/db");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  const userEmail = event.queryStringParameters?.email;

  if (!userEmail) {
    return response.error("Email is required.");
  }

  const params = {
    TableName: process.env.MESSAGES_TABLE,
    FilterExpression: "#to = :to",
    ExpressionAttributeNames: { "#to": "to" },
    ExpressionAttributeValues: { ":to": userEmail },
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return response.success(result.Items);
  } catch (error) {
    return response.error("Error fetching messages.");
  }
};
