const cognito = require("../config/cognito");
const dynamoDB = require("../config/db");
const response = require("../utils/response");

const ADMIN_SECRET_CODE = "ADMIN2025";

// ✅ REGISTRACIJA – koristi cognito.signUp()
const register = async (event) => {
  const body = JSON.parse(event.body);
  const { email, password, fullName, apartmentNumber, roleCode } = body;

  if (!email || !password || !fullName || !apartmentNumber) {
    return response.error("Sva polja su obavezna.");
  }

  let userRole = "user";
  if (roleCode && roleCode === ADMIN_SECRET_CODE) {
    userRole = "admin";
  } else if (roleCode && roleCode !== ADMIN_SECRET_CODE) {
    return response.error("Neispravan tajni kod za admina.");
  }

  const signUpParams = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "custom:role", Value: userRole }
    ],
  };

  try {
    await cognito.signUp(signUpParams).promise();

    const userParams = {
      TableName: process.env.USERS_TABLE,
      Item: {
        userId: email,          // ✅ ispravno ime prema tvojoj tabeli
        fullName,
        apartmentNumber,
        role: userRole,
        createdAt: new Date().toISOString(),
      },
    };
    

    await dynamoDB.put(userParams).promise();

    return response.success({ message: "Registracija uspješna. Provjerite email za verifikaciju." });
  } catch (error) {
    console.error("Register error:", error);
    return response.error("Greška: " + error.message);
  }
};

// ✅ LOGIN – koristi USER_PASSWORD_AUTH i vraća token + ulogu + ime + stan
const login = async (event) => {
  const body = JSON.parse(event.body);
  const { email, password } = body;

  if (!email || !password) {
    return response.error("Email i lozinka su obavezni.");
  }

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const authResult = await cognito.initiateAuth(params).promise();
    const token = authResult.AuthenticationResult.IdToken; // ✅ ovo koristi API Gateway authorizer

    // 🔎 Dohvati korisničke atribute

    const userDetails = await cognito
      .getUser({
        AccessToken: authResult.AuthenticationResult.AccessToken,
      })
      .promise();

    // ✅ Provjeri da li je email potvrđen
    const emailVerified = userDetails.UserAttributes.find(
      (attr) => attr.Name === "email_verified"
    )?.Value;

    if (emailVerified !== "true") {
      return response.error(
        "Email nije verifikovan. Provjerite svoj inbox i kliknite na verifikacijski link."
      );
    }

    // 🎭 Dohvati ulogu iz Cognito custom atributa
    const roleAttr = userDetails.UserAttributes.find(
      (attr) => attr.Name === "custom:role"
    );
    const userRole = roleAttr ? roleAttr.Value : "user";

    // ✅ Dohvati dodatne korisničke podatke iz DynamoDB
    const keyName = process.env.USERS_TABLE_PRIMARY_KEY || "userId";
    const userData = await dynamoDB
      .get({
        TableName: process.env.USERS_TABLE,
        Key: { [keyName]: email },
      })
      .promise();

    const fullName = userData.Item?.fullName || "";
    const apartmentNumber = userData.Item?.apartmentNumber || "";

    return response.success({ token, role: userRole, fullName, apartmentNumber });
  } catch (error) {
    console.error("❌ Login error:", {
  message: error.message,
  name: error.name,
  stack: error.stack,
});

    return response.error("Prijava neuspješna: " + error.message);
  }
};



// ✅ EXPORTI – zajednički
module.exports = {
  register,
  login
};
