const dynamoDB = require("../../config/db");
const response = require("../../utils/response");

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
