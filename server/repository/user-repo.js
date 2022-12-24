const userTable = require("../models/UserTable");


exports.UserLogin = async (email) => {
    // return await userTable.findOne({ where: { email: email } });
    return await userTable.query(`SELECT NAME,EMAIL,ROLE,UID FROM users_table WHERE email ='${email}'`);

}
