



const { Sequelize } = require('sequelize');
const { db } = require('../config/db_config');
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
    const orderDetails = await OrderTable.findAll({
        where: {
            uid: uid
        }
    });
    return orderDetails;
}
exports.getOrderItembyOID = async (oid) => {

    const orderItems = await db.query(`SELECT oT.uid,oT."orderId",oT.total_price,
    oT.status, fM.name,oIt.quantity,fM.price,fM.image,oT."createdAt"
        FROM order_table oT join
        "order_Item_table" oIt on oT."orderId" = oIt."orderId"
         join "foodMenu" fM on 
        fM."Fid" = oIt."Fid" where oT."orderId"=:oid;`,
        replacements = { oid: oid });
    return orderItems[0];

};

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
        await OrderItemTable.bulkCreate(orderItems, { transaction: t });
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
        let [[orderItem]] = await db.query(`SELECT oit.id as orderItemId, 
        quantity,"Fid" FROM "order_Item_table" oit JOIN order_table ot
        on ot."orderId" = oit."orderId" 
        WHERE ot.uid=:uid AND oit."Fid"=:fid;`,
            { replacements: { uid: uid, fid: item.Fid } });
        if (orderItem) {
            db.transaction(async (t) => {
                await OrderItemTable.increment('quantity', { by: item.quantity },
                    {
                        where: { id: orderItem.orderitemid },
                        transaction: t
                    });
                await FoodMenu.decrement('quantity', { by: item.quantity },
                    {
                        where: { Fid: item.Fid },
                        transaction: t
                    });
            })
            // await db.query(`BEGIN;`);
            // await db.query(`UPDATE "order_Item_table" SET quantity = quantity + ${item.quantity} 
            // WHERE id=${orderItem.orderitemid};`);
            // await db.query(`UPDATE "foodMenu" SET quantity = quantity - ${item.quantity} 
            // where "Fid"=${item.fid}`); // quantity update
            // await db.query(`COMMIT;`);
            return false;
        }
        itemsFiltered.push(item);
        console.log("items:", itemsFiltered);
    }));
    console.log(itemsFiltered);
    return itemsFiltered;
}
exports.cancelOrder = async (oid, status) => {
    const [[dbStatus]] = await getOrderStatus(oid);
    if (dbStatus.status === 'cancelled' || dbStatus.status === 'delivered'
        || dbStatus.status === 'confirmed' || dbStatus.status === 'rejected') {
        return { error: 'Order cannot be cancelled', status: false };
    }
    await db.query(`BEGIN;`);
    const [[{ orderId }]] = await orderStatusChange(oid, status);
    const [orderItems] = await getOrderItemsbyOid(orderId);
    await orderItems.forEach(async (item) => {
        await updateFoodQuantity(item);
    });
    await db.query(`COMMIT;`);
    return { orderId, status: true };
    // await db.query(`UPDATE "foodMenu" SET quantity=quantity-3 WHERE "Fid"=2`);
    // return order;
}
exports.updateStatus = async (oid, status) => {
    const [[dbStatus]] = await getOrderStatus(oid);
    if (dbStatus.status === 'cancelled' || dbStatus.status === 'accepted'
        || dbStatus.status === 'rejected') {
        return { error: 'Order cannot be updated', status: false };
    }
    const [[{ orderId }]] = await orderStatusChange(oid, status)
    return { orderId, status: true };
}
exports.getUIdofOrder = async (oid) => {
    const [[{ uid }]] = await getUidfromOrders(oid);
    return uid;
}
