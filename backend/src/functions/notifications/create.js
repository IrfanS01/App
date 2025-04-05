// src/functions/notifications/create.js
const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  if (!body.title || !body.message || !body.userId) {
    return response.error("Missing fields (title, message, userId)");
  }

  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
    Item: {
        id: uuidv4(),
        title: body.title,
        message: body.message,
        userId: body.userId,
        fullName: body.fullName || "Nepoznat korisnik",
        apartmentNumber: body.apartmentNumber || "?",
        createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return response.success({ message: "Notification created." });
  } catch (error) {
    return response.error("Error creating notification: " + error.message);
  }
};
