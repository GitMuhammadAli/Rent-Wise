const logger = require("../utils/logger");
const { ERROR_MESSAGE } = require("../messages/error");
const { RESPONCE_MESSAGE, LISTINGS } = require("../messages/response");
const { STATUS } = require("../messages/status");


const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || STATUS.INTERNAL_SERVER_ERROR;
    const errMessage = err.message || ERROR_MESSAGE.INTERNAL_SERVER_ERROR;
    logger.error(errMessage);
    logger.error(err.stack);
    console.error(`[Error] ${err}`)
    console.error(err.stack);  // Shows where the error originated

    res.status(statusCode).json({
        success: false,
        message: errMessage,
        stack: err.stack,
    });


}


module.exports = errorHandler