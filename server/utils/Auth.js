const jwt = require("jsonwebtoken");

exports.auth = async (req, res) => {
    const token = await req.headers.authorization.split(" ")[1];
    let authenticate = true;
    let userDet = jwt.verify(token, process.env.SECRET_KEY);
    if (!(userDet.role === "employee" || userDet.role === "admin")) {
        res.status(401).json({ message: "Unauthorized" });
        authenticate = false;
    }
    return authenticate;
}