const dynamoDB = require("../../config/db");
const response = require("../../utils/response");

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
