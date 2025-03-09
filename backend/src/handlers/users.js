const cognito = require("../config/cognito");
const response = require("../utils/response");


console.log("COGNITO_USER_POOL_ID TYPE:", typeof process.env.COGNITO_USER_POOL_ID);
console.log("COGNITO_USER_POOL_ID VALUE:", JSON.stringify(process.env.COGNITO_USER_POOL_ID, null, 2));
console.log("COGNITO_USER_POOL_ID TYPE:", typeof process.env.COGNITO_USER_POOL_ID);
console.log("COGNITO_USER_POOL_ID VALUE (JSON):", JSON.stringify(process.env.COGNITO_USER_POOL_ID));
console.log("COGNITO_USER_POOL_ID RAW:", process.env.COGNITO_USER_POOL_ID);




module.exports.getUsers = async () => {
    const params = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
    };

    try {
        const users = await cognito.listUsers(params).promise();
        return response.success(users.Users);
    } catch (error) {
        return response.error(error.message);
    }
};
