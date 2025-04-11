// 📁 src/handlers/notifications.js
const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");


// ✅ Kreiraj novu notifikaciju
module.exports.createNotification = async (event) => {
  const body = JSON.parse(event.body);
  const userId = event.requestContext.authorizer.claims.email;

  if (!userId || !body.title || !body.message) {
    return response.error("Missing fields.");
  }

  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
    Item: {
      userId,
      id: uuidv4(),
      title: body.title,
      message: body.message,
      fullName: body.fullName || "Nepoznat",
      apartmentNumber: body.apartmentNumber || "?",
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

// ✅ Dohvati notifikacije samo za prijavljenog korisnika
module.exports.getNotifications = async (event) => {
  const userId = event.requestContext.authorizer.claims.email;

  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: {
      ":uid": userId,
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return response.success(result.Items);
  } catch (err) {
    return response.error("Error fetching: " + err.message);
  }
};

// ✅ Obriši notifikaciju (samo ako je kreirao prijavljeni korisnik)
module.exports.deleteNotification = async (event) => {
  const id = event.pathParameters?.id;
  const userId = event.requestContext.authorizer.claims.email;

  if (!id || !userId) return response.error("Missing ID or user");

  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
    Key: { userId, id },
  };

  try {
    await dynamoDB.delete(params).promise();
    return response.success({ message: "Notification deleted" });
  } catch (err) {
    return response.error("Error deleting: " + err.message);
  }
};
