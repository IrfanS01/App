const cognito = require("../config/cognito");
const response = require("../utils/response");
console.log("COGNITO_CLIENT_ID TYPE:", typeof process.env.COGNITO_CLIENT_ID);
console.log("COGNITO_CLIENT_ID VALUE:", process.env.COGNITO_CLIENT_ID);

// ✅ Registracija korisnika u Cognito User Pool
console.log("COGNITO_CLIENT_ID TYPE:", typeof process.env.COGNITO_CLIENT_ID);
console.log("COGNITO_CLIENT_ID VALUE:", process.env.COGNITO_CLIENT_ID);


module.exports.register = async (event) => {
    const body = JSON.parse(event.body);

    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: body.email,
        Password: body.password,
        UserAttributes: [{ Name: "email", Value: body.email }],
    };

    try {
        await cognito.signUp(params).promise();
        return response.success({ message: "User registered successfully!" });
    } catch (error) {
        return response.error(error.message);
    }
};

// ✅ Prijava korisnika i dobijanje JWT tokena
module.exports.login = async (event) => {
    const body = JSON.parse(event.body);

    const params = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: body.email,
            PASSWORD: body.password,
        },
    };

    try {
        const result = await cognito.initiateAuth(params).promise();
        return response.success({ token: result.AuthenticationResult.IdToken });
    } catch (error) {
        return response.error(error.message);
    }
};
