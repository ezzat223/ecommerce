/**
 * @description     responsible for Operational errors 
 *                      Errors that you can detect 
 */
class ApiError extends Error {
    constructor ( message, statusCode){
        // send to parent class
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
        this.isOperational = true;
    };
}

module.exports = ApiError;