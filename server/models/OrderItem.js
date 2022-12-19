const { DataTypes } = require("sequelize");
const { db } = require("../config/db_config");

const OrderItemTable = db.define("order_Item_table",
    {
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: "order_table",
                key: 'orderId'
            }
        },
        Fid: {
            type: DataTypes.INTEGER,
            references: {
                model: "foodMenu",
                key: 'Fid'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }
    , { freezeTableName: true, timestamps: true });
module.exports = { OrderItemTable };