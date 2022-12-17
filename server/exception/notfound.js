module.exports = (req, res, next) => {
    // console.log("error===>", error);
    console.log("404 not found");
    return res.status(404).json({
        "error": "not Found Exception",
        statusCode: 404,
        message: "route not found"
    })
}