const { db } = require("../config/db_config");
const userTable = require("../models/UserTable");


exports.UserLogin = async (email, password) => {
    let user = await userTable.findOne({ where: { email: email } });
    return user.dataValues;
    // let data = await db.query(`SELECT NAME,EMAIL,ROLE,UID,PASSWORD FROM users_table WHERE email ='${email}'`);
    // return data[0];
}
