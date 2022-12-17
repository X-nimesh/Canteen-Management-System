module.exports = (error, req, res, next) => {
    // console.log("error===>", error);
    return res.status(400).json({
        error: error?.stack,
        statusCode: 400,
        message: error?.message
    })
}