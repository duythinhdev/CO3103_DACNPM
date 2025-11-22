const jwt = require('jsonwebtoken');
const fs = require('fs');
const Message = require('../models/Message');

class WebSocketManager {
    constructor(wss) {
        this.wss = wss;
        this.clientConns = {};

        this.wss.on('connection', (connection, req) => {
            this.handleConnection(connection, req);
        });
    }

    notifyAboutOnlinePeople() {
        console.log('clientConns', this.clientConns);
        const online = Object.entries(this.clientConns).map(([userId, c]) => ({
            userId,
            username: c.username,
        }));

        for (const [userId, conObj] of Object.entries(this.clientConns)) {
            conObj.client.send(JSON.stringify({ online }));
        }
    }

    handleConnection(connection, req) {
        connection.isAlive = true;

        connection.timer = setInterval(() => {
            connection.ping();
            connection.deathTimer = setTimeout(() => {
                connection.isAlive = false;
                clearInterval(connection.timer);
                connection.terminate();
                delete this.clientConns[connection.userId];
                this.notifyAboutOnlinePeople();
            }, 1000);
        }, 5000);

        connection.on("pong", () => {
            clearTimeout(connection.deathTimer);
        });

        this.handleAuth(connection, req);

        connection.on('message', (message) => {
            this.handleMessage(connection, message);
        });

        this.notifyAboutOnlinePeople();
    }

    handleAuth(connection, req) {
        const cookies = req.headers.cookie;
        if (!cookies) return;

        const tokenCookieString = cookies.split("; ").find((str) => str.startsWith("token="));
        if (!tokenCookieString) return;

        const token = tokenCookieString.split("=")[1];
        if (!token) return;

        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
            if (err) throw err;
            const { userId, username } = userData;

            this.clientConns[userId] = {
                username,
                client: connection,
            };

            connection.userId = userId;
            connection.username = username;
        });
    }

    async handleMessage(connection, message) {
        const { recipient, text, file } = JSON.parse(message);

        let filename = null;

        if (file) {
            const ext = file.name.split(".").pop();
            filename = `${Date.now()}.${ext}`;
            const path = __dirname + "/uploads/" + filename;

            const bufferData = Buffer.from(file.data.split(",")[1], "base64");
            fs.writeFileSync(path, bufferData);
        }

        if (recipient && (text || file)) {
            const messageDoc = await Message.create({
                type: "user",
                sender: connection.userId,
                recipient,
                text,
                file: filename,
            });
            console.log('Message saved:', messageDoc);

            this.clientConns[recipient]?.client?.send(
                JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    file: filename,
                    _id: messageDoc._id,
                }),
            );
        }
    }
}

module.exports = WebSocketManager;
