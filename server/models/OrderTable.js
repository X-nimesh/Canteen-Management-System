const { DataTypes } = require("sequelize");
const { db } = require("../config/db_config");

const OrderTable = db.define("order_table", {
    orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    uid: {
        type: DataTypes.INTEGER,
        references: {
            model: "users_table",
            key: "uid",
        },
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { freezeTableName: true, timestamps: true });

module.exports = OrderTable;