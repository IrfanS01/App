const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");

// ✅ Dodavanje nove obavijesti
module.exports.createNotification = async (event) => {
    let body;
  
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      return response.error("Neispravan format zahtjeva.");
    }
  
    // ✅ Dohvati userId iz tokena (email iz Cognito tokena)
    const userId = event.requestContext.authorizer.claims.email;
  
    if (!userId) {
      return response.error("User not authenticated.");
    }
  
    const params = {
      TableName: process.env.NOTIFICATIONS_TABLE,
      Item: {
        userId, // ✅ Obavezno: ključ koji koristiš u DynamoDB kao partition key
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
    } catch (error) {
      console.error("Put Error:", error);
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
  