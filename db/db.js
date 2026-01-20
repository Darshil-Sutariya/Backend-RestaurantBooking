const database = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = async () => {
    try {
        await database.connect(process.env.MONGO_URI);
        console.log("database is connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = db;