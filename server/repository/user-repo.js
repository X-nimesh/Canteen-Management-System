const { db } = require("../config/db_config");


exports.UserLogin = async (email) => {
    // return await userTable.findOne({ where: { email: email } });
    let data = await db.query(`SELECT NAME,EMAIL,ROLE,UID,PASSWORD FROM users_table WHERE email ='${email}'`);
    return data[0];
}
