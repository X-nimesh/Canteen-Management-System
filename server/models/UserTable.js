import { DataTypes } from "sequelize";
import { db } from "../config/db_config";


const userTable = db.define("users_table",
    {
        uid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
    }, { freezeTableName: true, timestamps: true });

module.exports = userTable;