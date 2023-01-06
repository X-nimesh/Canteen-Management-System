const { db } = require("../config/db_config");



exports.getOrderStatus = async (oid) => {
    return await db.query(`Select status from order_table where "orderId"=${oid}`);

}

exports.orderStatusChange = async (oid, status) => {
    return await db.query(`UPDATE order_table SET status='${status}'
    WHERE "orderId"=${oid} RETURNING "orderId";`);
}
exports.getOrderItemsbyOid = async (orderId) => {
    return await db.query(`SELECT * FROM "order_Item_table" 
    WHERE "orderId"=${orderId}`)
}
exports.updateFoodQuantity = async (item) => {
    return await db.query(`UPDATE "foodMenu" SET quantity = quantity + ${item.quantity}
    WHERE "Fid"=${item.Fid}`);
}
exports.getUidfromOrders = async (oid) => {
    return await db.query(`SELECT uid FROM order_table WHERE "orderId"=${oid}`);
}
exports.getorderItemsbyUidandFid = async (uid, item) => {
    return await db.query(`SELECT oit.id as orderItemId, 
 quantity,"Fid" FROM "order_Item_table" oit JOIN order_table ot
 on ot."orderId" = oit."orderId" 
 WHERE ot.uid=:uid AND oit."Fid"=:fid`,
        { replacements: { uid: uid, fid: item.fid } });
}
exports.getBillbyOid = async (oid) => {
    let [bill] = await db.query(`SELECT  Ot."orderId",uid,total_price, name as productName, price,image,oIt.quantity,status,oT."createdAt" FROM order_table oT  JOIN
    "order_Item_table" oIt on oT."orderId" = oIt."orderId"
          JOIN "foodMenu" fM on oIt."Fid" = fM."Fid"
    where oIt."orderId"=:oid `,
        {
            replacements: { oid: oid }
        });
    return bill;
}