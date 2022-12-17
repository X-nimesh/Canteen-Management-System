
const dbConnection = async (db) => {
    try {
        await db.authenticate('connected')
    } catch (error) {
        console.log(error);
    }
    db.sync({ alter: true });

}
module.exports = { dbConnection };