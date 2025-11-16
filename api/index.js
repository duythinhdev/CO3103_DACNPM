const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const Message = require("./models/Message");
const ws = require("ws");
const fs = require('fs');
const userRouter = require('../api/router/user/index');
const groupRouter = require('../api/router/group/index');
const { getUserDataFromRequest } = require('../api/util/index');
require("./util/passport");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, (err) => {
  if (err) throw err;
});
const jwtSecret = process.env.JWT_SECRET;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.get("/messages/:userId", async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.use("/user", userRouter);
app.use("/group", groupRouter);

const server = app.listen(7878);

const wss = new ws.WebSocketServer({ server });
let clientConns = {};
wss.on("connection", (connection, req) => {
  function notifyAboutOnlinePeople() {
    for (const [userId, conObject] of Object.entries(clientConns)) {
      conObject.client.send(
        JSON.stringify({
          online: Object.entries(clientConns).map(([userId, conObject]) => ({
            userId: userId,
            username: conObject.username,
          })),
        }),
      );
    }
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }, 1000);
  }, 5000);

  connection.on("pong", () => {
    clearTimeout(connection.deathTimer);
  });

  // read username and id form the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookieString = cookies.split("; ").find((str) => str.startsWith("token="));
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1];
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          clientConns[userId] = {
            username: username,
            client: connection,
          };
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text, file } = messageData;
    let filename = null;
    if (file) {
      console.log("size", file.data.length);
      const parts = file.name.split(".");
      const ext = parts[parts.length - 1];
      filename = Date.now() + "." + ext;
      const path = __dirname + "/uploads/" + filename;
      const bufferData = new Buffer(file.data.split(",")[1], "base64");
      fs.writeFile(path, bufferData, () => {
        console.log("file saved:" + path);
      });
    }

    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        type: "user",
        sender: connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });

      clientConns[recipient].client.send(
        JSON.stringify({
          text,
          sender: connection.userId,
          recipient,
          file: file ? filename : null,
          _id: messageDoc._id,
        }),
      );
    }
  });
  notifyAboutOnlinePeople();
});
