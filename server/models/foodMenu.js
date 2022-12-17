const { db } = require("../config/db_config");
const { DataTypes } = require("sequelize");

const FoodMenu = db.define("foodMenu",
    {
        Fid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, { freezeTableName: true, timestamps: true });
module.exports = { FoodMenu };