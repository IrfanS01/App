const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");

// ✅ Dodavanje nove obavijesti
module.exports.createNotification = async (event) => {
    const body = JSON.parse(event.body);

    const params = {
        TableName: process.env.NOTIFICATIONS_TABLE,
        Item: {
            id: uuidv4(),
            title: body.title,
            message: body.message,
            createdAt: new Date().toISOString(),
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return response.success({ message: "Notification created" });
    } catch (error) {
        return response.error(error.message);
    }
};

// ✅ Dohvatanje svih obavijesti
module.exports.getNotifications = async () => {
    const params = {
        TableName: process.env.NOTIFICATIONS_TABLE,
    };

    try {
        const result = await dynamoDB.scan(params).promise();
        return response.success(result.Items);
    } catch (error) {
        return response.error(error.message);
    }
};
module.exports.deleteNotification = async (event) => {
    const id = event.pathParameters?.id;
  
    if (!id) return response.error("ID is required");
  
    const params = {
      TableName: process.env.NOTIFICATIONS_TABLE,
      Key: { userId: event.requestContext.authorizer.claims.email, id },
    };
  
    try {
      await dynamoDB.delete(params).promise();
      return response.success({ message: "Notification deleted" });
    } catch (error) {
      return response.error("Delete failed: " + error.message);
    }
  };
  