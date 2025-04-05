const dynamoDB = require("../../config/db");
const response = require("../../utils/response");

module.exports.handler = async () => {
  const params = {
    TableName: process.env.NOTIFICATIONS_TABLE,
  };

  try {
    const result = await dynamoDB.scan(params).promise();
    return response.success(result.Items);
  } catch (error) {
    return response.error("Error fetching notifications: " + error.message);
  }
};