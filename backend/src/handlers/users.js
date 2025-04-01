const cognito = require("../config/cognito");
const dynamoDB = require("../config/db");
const response = require("../utils/response");

module.exports.getUsers = async () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
  };

  try {
    const usersFromCognito = await cognito.listUsers(params).promise();

    // 🔁 Za svakog korisnika iz Cognito, dohvati dodatne podatke iz DynamoDB
    const usersWithDetails = await Promise.all(
      usersFromCognito.Users.map(async (user) => {
        const emailAttr = user.Attributes.find((attr) => attr.Name === "email");
        const email = emailAttr ? emailAttr.Value : user.Username;

        let dynamoDetails = {};
        try {
          const result = await dynamoDB
            .get({
              TableName: process.env.USERS_TABLE,
              Key: { [process.env.USERS_TABLE_PRIMARY_KEY]: email }

            })
            .promise();
          dynamoDetails = result.Item || {};
        } catch (err) {
          console.warn(`Greška kod DynamoDB za korisnika ${email}:`, err);
        }

        return {
          email,
          role:
            user.Attributes.find((attr) => attr.Name === "custom:role")?.Value ||
            "user",
          fullName: dynamoDetails.fullName || "N/A",
          apartmentNumber: dynamoDetails.apartmentNumber || "?",
          status: user.Enabled ? "enabled" : "disabled",
        };
      })
    );

    return response.success(usersWithDetails);
  } catch (error) {
    console.error("Greška u getUsers:", error);
    return response.error("Greška prilikom dohvata korisnika.");
  }
};
