const { Sequelize } = require('sequelize');
const { db } = require('../config/db_config');
const userTable = require('../models/UserTable');

exports.findAllUser = async () => {
    // const users = await userTable.query('SELECT NAME,EMAIL,ROLE,UID FROM users_table');
    // const users = await db.query('SELECT NAME,EMAIL,ROLE,UID FROM users_table');
    // return users;
    return await userTable.findAll();
}
