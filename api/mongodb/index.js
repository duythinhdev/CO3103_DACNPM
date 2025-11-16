const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('strictQuery', false);
exports.connectionDb = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connected"))
        .catch(err => console.error(err));
}