const dynamoDB = require("../../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../../utils/response");

module.exports.handler = async (event) => {
  const { reservationId, userId } = JSON.parse(event.body);

  const params = {
    TableName: process.env.RESERVATIONS_TABLE,
    Key: {
      userId,
      reservationId,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    return response.success({ message: "Reservation deleted." });
  } catch (err) {
    return response.error("Failed to delete reservation.", 500, err);
  }
};