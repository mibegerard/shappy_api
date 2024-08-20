const asyncHandler = (func) => {
    return function (req, res, next) {
        return Promise.resolve(func(req, res, next)).catch((e) => {
            next(e)
        })
    }
}
module.exports = asyncHandler;