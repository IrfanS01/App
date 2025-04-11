// src/functions/notifications/create.js
const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const userId = event?.requestContext?.authorizer?.claims?.email;

  if (!userId || !body.title || !body.message) {
    return response.error("Missing fields.");
  }

  // ⬇️ Dohvati podatke korisnika iz USERS_TABLE
  let userDetails = {};
  try {
    const result = await dynamoDB.get({
      TableName: process.env.USERS_TABLE,
      Key: {
        [process.env.USERS_TABLE_PRIMARY_KEY]: userId,
      },
    }).promise();
    userDetails = result.Item || {};
  } catch (err) {
    console.warn("Failed to fetch user details:", err);
  }

  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
    Item: {
      userId,
      id: uuidv4(),
      title: body.title,
      message: body.message,
      fullName: userDetails.fullName || "Nepoznat",
      apartmentNumber: userDetails.apartmentNumber || "?",
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return response.success({ message: "Notification created" });
  } catch (err) {
    return response.error("Error creating: " + err.message);
  }
};
