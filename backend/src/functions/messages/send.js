// src/functions/messages/send.js
const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { from, to, message } = body;

  if (!from || !to || !message) {
    return response.error("Missing fields.");
  }

  const params = {
    TableName: process.env.MESSAGES_TABLE,
    Item: {
      id: uuidv4(),
      from,
      to,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return response.success({ message: "Message sent." });
  } catch (error) {
    return response.error("Error sending message.");
  }
};
