const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");

// ➕ Kreiranje rezervacije
module.exports.createReservation = async (event) => {
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

  // ✅ Provjera duplikata
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

  // ➕ Dohvati korisničke podatke
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

// 📥 Dohvati sve rezervacije
module.exports.getReservations = async () => {
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

// ❌ Brisanje rezervacije
module.exports.deleteReservation = async (event) => {
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
