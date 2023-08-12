const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

exports.getUserDataFromRequest = async (req) => {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });
}