const mongoose = require('mongoose');

class Database {
    constructor() {
        mongoose.set('strictQuery', true);
        require('dotenv').config();
        this.mongoUrl = process.env.MONGO_URL;
    }

    async connect() {
        try {
            await mongoose.connect(this.mongoUrl);
            console.log("MongoDB Connected");

            this._handleEvents();
        } catch (error) {
            console.error("MongoDB connection error:", error);
        }
    }

    _handleEvents() {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB event: connected");
        });

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB event: error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB event: disconnected");
        });
    }
}

module.exports = new Database();