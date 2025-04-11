const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch (error) {
    return response.error("Invalid JSON format in request body.");
  }

  const { user, type, date } = body;

  if (!user || !type || !date) {
    return response.error("Missing required fields: user, type, or date.");
  }

  if (!process.env.RESERVATIONS_TABLE || !process.env.USERS_TABLE || !process.env.USERS_TABLE_PRIMARY_KEY) {
    return response.error("Table environment variables are missing.");
  }

  try {
    const existing = await dynamoDB.scan({
      TableName: process.env.RESERVATIONS_TABLE,
      FilterExpression: "#date = :date AND #user = :user AND #type = :type",
      ExpressionAttributeNames: {
        "#date": "date",
        "#user": "user",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":date": date,
        ":user": user,
        ":type": type,
      },
    }).promise();

    if (existing.Items.length > 0) {
      return response.error("You already have a reservation for this date and type.");
    }
  } catch (error) {
    console.error("DynamoDB Scan Error:", error);
    return response.error("Database error while checking existing reservations.");
  }

  let userDetails;
  try {
    const keyName = process.env.USERS_TABLE_PRIMARY_KEY;
    const result = await dynamoDB.get({
      TableName: process.env.USERS_TABLE,
      Key: { [keyName]: body.user },
    }).promise();

    userDetails = result.Item || {};
  } catch (err) {
    console.warn("Failed to fetch user details for reservation:", err);
    userDetails = {};
  }

  const reservationId = body.id || uuidv4();

  const params = {
    TableName: process.env.RESERVATIONS_TABLE,
    Item: {
      reservationId,
      user,
      userId: user,
      type,
      date,
      fullName: userDetails.fullName || "Unknown",
      apartmentNumber: userDetails.apartmentNumber || "?",
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    return response.success({ message: "Reservation created!", data: params.Item });
  } catch (error) {
    console.error("DynamoDB Put Error:", error);
    return response.error("Error saving reservation. Please try again.");
  }
};