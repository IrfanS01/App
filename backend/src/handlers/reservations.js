const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");

// ✅ Kreiranje rezervacije
module.exports.createReservation = async (event) => {
    const body = JSON.parse(event.body);

    const params = {
        TableName: process.env.RESERVATIONS_TABLE,
        Item: {
            id: uuidv4(),
            user: body.user,
            type: body.type,
            date: body.date,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return response.success({ message: "Reservation created!" });
    } catch (error) {
        return response.error(error.message);
    }
};

// ✅ Dohvatanje svih rezervacija
module.exports.getReservations = async () => {
    const params = {
        TableName: process.env.RESERVATIONS_TABLE,
    };

    try {
        const result = await dynamoDB.scan(params).promise();
        return response.success(result.Items);
    } catch (error) {
        return response.error(error.message);
    }
};
