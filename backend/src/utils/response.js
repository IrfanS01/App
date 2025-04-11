const defaultHeaders = {
    'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    // 'Access-Control-Allow-Methods': 'OPTIONS,POST,GET' // opciono
};

module.exports.success = (data, message = "Success") => {
    return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({
            status: "success",
            message,
            data,
            timestamp: new Date().toISOString(),
        }),
    };
};

module.exports.error = (message, statusCode = 400, errorDetails = null) => {
    return {
        statusCode,
        headers: defaultHeaders,
        body: JSON.stringify({
            status: "error",
            message,
            error: errorDetails
                ? {
                      name: errorDetails.name,
                      message: errorDetails.message,
                      stack: errorDetails.stack,
                  }
                : null,
            timestamp: new Date().toISOString(),
        }),
    };
};
