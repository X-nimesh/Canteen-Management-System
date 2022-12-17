const { Sequelize } = require("sequelize");

// require('dotenv').config({ path: './.dev.env' }); //to use custom name env 
require('dotenv').config({ path: './.dev.env' });
const db = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.USER,
    password: process.env.PASSWORD,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    logging: true
})
module.exports = { db };