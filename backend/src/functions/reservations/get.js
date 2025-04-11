const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async () => {
  const params = {
    TableName: process.env.RESERVATIONS_TABLE,
  };

  try {
    const result = await dynamoDB.scan(params).promise();

    const reservations = result.Items.map((res) => ({
      id: res.reservationId || res.id || "n/a",
      user: res.user || "Unknown",
      userName: res.fullName || "Unknown",
      apartmentNumber: res.apartmentNumber || "?",
      type: res.type || "Unknown",
      date: res.date,
      createdAt: res.createdAt || "N/A",
    }));

    return response.success(reservations);
  } catch (error) {
    console.error("DynamoDB Get Reservations Error:", error);
    return response.error("Error fetching reservations.");
  }
};