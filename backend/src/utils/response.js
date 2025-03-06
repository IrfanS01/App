module.exports.success = (data, message = "Success") => {
    return {
        statusCode: 200,
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
