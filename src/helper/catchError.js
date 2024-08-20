const ErrorResponse = require('./errorResponse.js')
const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message
    // log to console for dev
    // mongoose bad ObjectId

    //console.log(error)

    if (error.errno === 1062)
        error = new ErrorResponse(error.sqlMessage, 404)

    // if (err.errno === 1452)
    //     error = new ErrorResponse(`Please select parent id for your insertion`, 404)

    if (err.name === "CastError")
        error = new ErrorResponse(`Resource not found with this id of ${err.value}`, 404)

    const getFieldAndValue = (objectName) => {
        for (let field in objectName) {
            // name of field and value
            //`${field}: ${objectName[field]}`;

            // just value
            return `${objectName[field]}`;
        }
    }

    // mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${getFieldAndValue(err.keyValue)} , please insert another value`
        error = new ErrorResponse(message, 400)
    }

    // mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => {
            return `${val.message}`
        })

        error = new ErrorResponse(message, 400)
    }

    if (error.statusCode === 204) {
        res.send({
            data: null
        })
    }

    res.status(error.statusCode || 500)
        .json({
            success: false,
            error: error.message
        })

    console.log("Error =====> ", error.message)

}

module.exports = errorHandler;