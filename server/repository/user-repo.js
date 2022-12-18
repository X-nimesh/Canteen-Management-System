const userTable = require("../models/UserTable");


exports.UserLogin = async (email) => {
    return await userTable.findOne({ where: { email: email } });

}
