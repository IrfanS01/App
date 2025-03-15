const dynamoDB = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const response = require("../utils/response");

// ✅ Kreiranje rezervacije
module.exports.createReservation = async (event) => {
    let body;

    // ✅ Sigurno parsiranje JSON-a
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return response.error("Invalid JSON format in request body.");
    }

    // ✅ Provjera da li su obavezna polja prisutna
    if (!body.user || !body.type || !body.date) {
        return response.error("Missing required fields: user, type, or date.");
    }

    // ✅ Provjera da li je varijabla za ime tabele definisana
    if (!process.env.RESERVATIONS_TABLE) {
        return response.error("DynamoDB table name is not defined in environment variables.");
    }

    // ✅ Provjera da li već postoji rezervacija za isti datum i tip od istog korisnika
    try {
        const existingReservations = await dynamoDB.scan({
            TableName: process.env.RESERVATIONS_TABLE,
            FilterExpression: "#date = :date AND #user = :user AND #type = :type",
            ExpressionAttributeNames: { 
                "#date": "date", 
                "#user": "user",
                "#type": "type"
            },
            ExpressionAttributeValues: { 
                ":date": body.date,
                ":user": body.user,
                ":type": body.type
            }
        }).promise();

        if (existingReservations.Items.length > 0) {
            return response.error("You already have a reservation for this date and type.");
        }
    } catch (error) {
        console.error("DynamoDB Scan Error:", error);
        return response.error("Database error while checking existing reservations.");
    }

    // ✅ Generiši UUID ako nije poslan
    const reservationId = body.id || uuidv4();

    // ✅ Kreiranje objekta za novu rezervaciju
    const params = {
        TableName: process.env.RESERVATIONS_TABLE,
        Item: {
            id: reservationId,
            user: body.user,
            type: body.type,
            date: body.date,
            createdAt: new Date().toISOString()
        },
    };

    try {
        // ✅ Upisivanje rezervacije u DynamoDB
        await dynamoDB.put(params).promise();
        return response.success({ message: "Reservation created!", data: params.Item });
    } catch (error) {
        console.error("DynamoDB Put Error:", error);
        return response.error("Error saving reservation. Please try again.");
    }
};

// ✅ Dohvatanje svih rezervacija
module.exports.getReservations = async () => {
    const params = {
        TableName: process.env.RESERVATIONS_TABLE,
    };

    try {
        const result = await dynamoDB.scan(params).promise();

        // ✅ Osiguravanje da svi zapisi imaju potrebna polja
        const reservations = result.Items.map(res => ({
            id: res.id,
            user: res.user || "Unknown",  // Ako nedostaje, postavi default
            type: res.type || "Unknown",  // Ako nedostaje, postavi default
            date: res.date,
            createdAt: res.createdAt || "N/A" // Ako nedostaje, postavi default
        }));

        return response.success(reservations);
    } catch (error) {
        console.error("DynamoDB Get Reservations Error:", error);
        return response.error("Error fetching reservations.");
    }
};
