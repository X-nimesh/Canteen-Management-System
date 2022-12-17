const { db } = require("../config/db_config");

const OrderTable = db.define("order_Item_table",
    {
        orderId: {
            type: DataTypes.INTEGER,
            references: {
                model: OrderTable,
                key: 'orderId'
            }
        },
        Fid: {
            type: DataTypes.INTEGER,
            references: {
                model: FoodMenu,
                key: 'Fid'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }
    , { freezeTableName: true, timestamps: true });
module.exports = { OrderTable };