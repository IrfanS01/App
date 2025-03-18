const cognito = require("../config/cognito");
const response = require("../utils/response");

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
