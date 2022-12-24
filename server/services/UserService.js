const { Sequelize } = require('sequelize');
const userTable = require('../models/UserTable');

exports.findAllUser = async () => {
    // const users = await userTable.query('SELECT NAME,EMAIL,ROLE,UID FROM users_table');
    const users = await Sequelize.query('SELECT NAME,EMAIL,ROLE,UID FROM users_table');
    return users;
}
