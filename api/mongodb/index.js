const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

exports.connectionDb = () => {
    mongoose.connect(process.env.MONGO_URL, (err) => {
        if (err) throw err;
    });
}