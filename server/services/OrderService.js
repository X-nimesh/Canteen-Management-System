



const { Sequelize } = require('sequelize');
const { db } = require('../config/db_config');
const { FoodMenu } = require('../models/FoodMenu');
const { OrderItemTable } = require('../models/OrderItem');
const OrderTable = require('../models/OrderTable');
const { updateFoodQuantity, getOrderItemsbyOid, orderStatusChange, getOrderStatus, getUidfromOrders } = require('../repository/order-repo');

exports.getAllOrder = async (oid) => {

    // const orderItems = await db.query(`SELECT "orderId",total_price,
    // status,uid, "createdAt" FROM order_table `);
    const orderItems = await OrderTable.findAll();
    return orderItems[0];

};
exports.GetOrderDetailsByOID = async (oid) => {
    // const [orderDetails] =
    //     await db.query(`SELECT "orderId",total_price,"createdAt" ,status
    //         FROM order_table WHERE "orderId"=${oid};`);
    const orderDetails = await OrderTable.findAll({
        where: {
            orderId: oid
        }
    });
    return orderDetails;
}
exports.GetOrderDetailsByUID = async (uid) => {
    // const [orderDetails] =
    //     await db.query(`SELECT "orderId",total_price,"createdAt" ,status
    //         FROM order_table WHERE "uid"=${uid};`);
    // const orderDetails = await OrderTable.findAll({
    //     where: {
    //         uid: uid
    //     }
    // });
    let orderDetails = [];
    const orders = await OrderTable.findAll({
        where: {
            uid: uid
        }
    });
    await Promise.all(orders.map(async (order) => {

        let [orderItems] = await getOrderItemsbyOid(order.dataValues.orderId);
        orderDetails.push({
            oid: order.dataValues.orderId,
            Total_Price: order.dataValues.total_price,
            orderItems
        });
    }));
    return orderDetails;
}
exports.getOrderItembyOID = async (oid) => {
    const [orderItems] = await db.query(`SELECT oT.uid,oT."orderId",oT.total_price,
    oT.status, fM.name,oIt.quantity,fM.price,fM.image,oT."createdAt"
        FROM order_table oT join
        "order_Item_table" oIt on oT."orderId" = oIt."orderId"
         join "foodMenu" fM on 
        fM."Fid" = oIt."Fid" where oT."orderId"=:oid;`,
        { replacements: { oid: oid } });
    return orderItems[0];

};
exports.CheckItemAvailable = async (orderItem) => {
    let itemsNotAvailable = [];
    await Promise.all(orderItem.map(async (item) => {
        const itemsNot = await FoodMenu.findAll({
            attributes: [
                "Fid",
                "name",
                "quantity",
            ],
            where: {
                Fid: item.Fid
            }
        });
        if (itemsNot[0].quantity < item.quantity) {
            itemsNotAvailable = [...itemsNotAvailable, itemsNot[0]];
        }
    }));

    return itemsNotAvailable;
}
exports.addOrder = async (orderReq, orderItems) => {
    // const order = await OrderTable.create(orderReq);
    console.log(orderReq, orderItems);
    // transaction start
    // await db.query(`BEGIN;`);
    // // orderCreated
    // const [[order]] = await db.query(`INSERT INTO order_table
    //     ("orderId", total_price, status, uid, "createdAt", "updatedAt")
    //     VALUES (DEFAULT, ${orderReq.total_price}, '${orderReq.status}',  ${orderReq.uid}
    //         , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    //         RETURNING "orderId" ;`,);

    // await orderItems.forEach(async (item) => {
    //     await db.query(`INSERT INTO "order_Item_table"
    //             ("orderId", "Fid", quantity, id, "createdAt", "updatedAt")
    //             VALUES (${order.orderId}, ${item.fid},${item.quantity}, 
    //                 DEFAULT, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`);
    //     await db.query(`UPDATE "foodMenu" SET quantity = quantity - ${item.quantity} 
    //                     where "Fid"=${item.fid}`); // quantity update

    // });
    // console.log(order.orderId);
    // await db.query(`COMMIT;`);
    // transaction end


    let order;
    await db.transaction(async (t) => {
        order = await OrderTable.create(orderReq, { transaction: t });
        let updatedItems = orderItems.map(item => ({ ...item, orderId: order.orderId }));
        console.log(updatedItems);
        await OrderItemTable.bulkCreate(updatedItems, { transaction: t });
    })
    return order;
}
exports.additems = async (orderItems) => {
    await db.query(`BEGIN;`);
    await orderItems.forEach(async (item) => {
        await db.query(`INSERT INTO "order_Item_table"
                ("orderId", "Fid", quantity, id, "createdAt", "updatedAt")
                VALUES (${item.orderId}, ${item.fid},${item.quantity}, 
                    DEFAULT, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`);
        await db.query(`UPDATE "foodMenu" SET quantity = quantity - ${item.quantity} 
                        where "Fid"=${item.fid}`); // quantity update

    });
    await db.query(`COMMIT;`);
    return order;
}
const filterItem = async (item, uid, itemsFiltered) => {
    let [[orderItem]] = await getorderItemsbyUidandFid(uid, item);
    if (orderItem) {
        await db.query(`BEGIN;`);
        await db.query(`UPDATE "order_Item_table" SET quantity = quantity + ${item.quantity} 
            WHERE id=${orderItem.orderitemid};`);
        await db.query(`UPDATE "foodMenu" SET quantity = quantity - ${item.quantity} 
            where "Fid"=${item.fid}`); // quantity update
        await db.query(`COMMIT;`);
        return false;
    }
    itemsFiltered.push(item);
    console.log("items:", itemsFiltered);
}
exports.addDuplicateItems = async (orderItems, uid) => {
    console.log('hey');
    let itemsFiltered = [];
    await Promise.all(orderItems.map(async (item) => {
        let [[orderItem]] = await db.query(`SELECT oit.id as orderItemId,ot."orderId" ,
        quantity,"Fid" FROM "order_Item_table" oit JOIN order_table ot
        on ot."orderId" = oit."orderId" 
        WHERE ot.uid=:uid AND oit."Fid"=:fid;`,
            { replacements: { uid: uid, fid: item.Fid } });
        if (orderItem) {
            await db.transaction(async (t) => {
                let items = await OrderItemTable.findAll({
                    where: {
                        id: orderItem.orderitemid
                    }
                }, { transaction: t });
                let foodmenu = await FoodMenu.findAll({
                    where: {
                        Fid: item.Fid
                    }
                }, { transaction: t });
                let order = await OrderTable.findOne({
                    where: {
                        orderId: orderItem.orderId
                    }
                }, { transaction: t });
                await order.increment('total_price', { by: item.quantity * item.price }, { transaction: t });
                await items[0].increment('quantity', { by: item.quantity }, { transaction: t });
                await foodmenu[0].decrement('quantity', { by: item.quantity }, { transaction: t });

            })
            return false;
        }
        itemsFiltered.push(item);
        console.log("items:", itemsFiltered);
    }));
    console.log(itemsFiltered);
    return itemsFiltered;
}
exports.cancelOrder = async (oid, status) => {
    const dbStatus = (await OrderTable.findOne({
        where: {
            orderId: oid
        }
    }, { attributes: ['status'] }))?.dataValues?.status;
    // checking if the oreder is already cancelled
    if (dbStatus.status === 'cancelled' || dbStatus.status === 'delivered'
        || dbStatus.status === 'confirmed' || dbStatus.status === 'rejected') {
        return { error: 'Order cannot be cancelled', status: false };
    }
    // start of a transcation to update the order status and food quantity
    await db.transaction(async (t) => {
        const order = await OrderTable.findOne({
            where: {
                orderId: oid
            }
        }, { transaction: t });
        // updating the order status
        await order.update({ status }, { transaction: t });
        const orderItems = await OrderItemTable.findAll({
            where: {
                orderId: order.orderId
            }
        }, { transaction: t });
        // updating the food quantity
        Promise.all(orderItems.map(async (item) => {
            const food = await FoodMenu.findOne({
                where: {
                    Fid: item.Fid
                }
            }, { transaction: t });
            await food.increment('quantity', { by: item.quantity }, { transaction: t });
        }));
    });
    return { status: true };

}
exports.updateStatus = async (oid, status) => {
    // status of the order
    const dbStatus = (await OrderTable.findOne({
        where: {
            orderId: oid
        }
    }, { attributes: ['status'] }))?.dataValues?.status;

    // checking if the oreder is cancelled or accepted or rejected
    if (dbStatus.status === 'cancelled' || dbStatus.status === 'accepted'
        || dbStatus.status === 'rejected') {
        return { error: 'Order cannot be updated', status: false };
    }
    const orders = await OrderTable.update({ status }, {
        where: {
            orderId: oid
        }
    });
    return { status: true };
}
exports.updateOrderItem = async (oid, items) => {
    let orderDetail = await OrderTable.findOne({
        where: {
            orderId: oid
        }
    }, { attributes: ['total_price'] });
    let totalprice = orderDetail.dataValues.total_price;
    let itemstatus = { status: true };
    await db.transaction(async (t) => {
        await Promise.all(items.map(async (item) => {
            let orderItembyOid = await OrderItemTable.findOne({
                where: {
                    Fid: item.Fid,
                    orderId: oid
                }
            }, { transaction: t });
            if (orderItembyOid) {
                let Food = await FoodMenu.findOne({
                    where: {
                        Fid: item.Fid
                    }
                }, { transaction: t })
                if (item.quantity < 0) {
                    if (orderItembyOid.quantity < Math.abs(item.quantity)) {
                        itemstatus.status = false;
                        itemstatus.quantity = orderItembyOid.quantity;
                    }
                    else {
                        // increase food ammount in menu
                        await Food.increment('quantity', { by: Math.abs(item.quantity) }, { transaction: t });

                        await orderItembyOid.decrement('quantity', { by: Math.abs(item.quantity) }, { transaction: t });
                        totalprice = totalprice - (Math.abs(item.quantity) * item.price);
                    }
                }
                else {
                    // decrease food ammount in menu

                    await Food.decrement('quantity', { by: item.quantity }, { transaction: t });

                    await orderItembyOid.increment('quantity', { by: item.quantity }, { transaction: t });
                    totalprice = totalprice + (item.quantity * item.price);
                }

            }
        }));
        orderDetail = await OrderTable.update({ total_price: totalprice }, {
            where: {
                orderId: oid
            }
        }, { transaction: t });

    });
    if (!itemstatus.status) {
        console.log("status item not enough ")
        return { error: `Order Item quantiy is only ${itemstatus.quantity}`, status: false };

    }
    return ({ orderDetail, status: true });
}
exports.getUIdofOrder = async (oid) => {
    const uid = await OrderTable.findOne({
        where: {
            orderId: oid
        }
    }, { attributes: ['uid'] });
    // const [[{ uid }]] = await getUidfromOrders(oid);
    return uid;
}
