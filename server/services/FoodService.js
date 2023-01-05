const { db } = require("../config/db_config");
const { FoodMenu } = require("../models/foodMenu");

exports.FoodDecrease = async (Fid) => {

}
exports.AllFood = async () => {
    console.log("as");
    const product = await FoodMenu.findAll();
    // const [products] = await db.query(`SELECT "Fid",name,price,description,image,
    // "createdAt",quantity FROM "foodMenu"`);

    return product;

}
exports.getByFid = async (Fid) => {

    const product = await FoodMenu.findAll({
        where: { Fid: Fid },
        attributes: ["Fid", "name", "price", "description", "image", "createdAt", "quantity"]
    });
    // const [product] = await db.query(`SELECT "Fid",name,price,description,
    // image,"createdAt",quantity
    // FROM "foodMenu" WHERE "Fid" = ${Fid}`);
    return product;

}
exports.FoodAdd = async (req) => {

    const product = await FoodMenu.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename,
        quantity: req.body.quantity
    });

    // const product = await db.query(`INSERT INTO "foodMenu" 
    // ("Fid", name, price, description, image, "createdAt", "updatedAt", quantity)
    //     VALUES  (DEFAULT,'${req.body.name}',${req.body.price},
    //     '${req.body.description}','${req.file.filename}',
    //     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
    // ${ req.body.quantity })`);
    return product;

}
exports.FoodUpdateService = async (req, Fid) => {
    // const product = await db.query(`UPDATE "foodMenu" SET name = '${req.body.name}',
    //     price = ${req.body.price}, description = '${req.body.description}',
    //         image = '${req.file.filename}', "updatedAt" = CURRENT_TIMESTAMP,
    //         quantity = ${req.body.quantity} WHERE "Fid" = ${Fid} `);
    const product = await FoodMenu.update({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename,
        quantity: req.body.quantity
    }, {
        where: { Fid: Fid }
    });

    return product;
}
