const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { WebSocketServer } = require("ws");
const { getUserDataFromRequest } = require('../api/util/index');
const { connectionDb } = require('../api/mongodb/index');
require('./util/passport');

const Message = require('./models/Message');
const userRouter = require('../api/router/user/index');
const groupRouter = require('../api/router/group/index');
const WebSocketManager = require('./wss/WebSocketManager');

dotenv.config();

const app = express();
connectionDb();
app.use(cors({ credentials: true, origin: process.env.VITE_APP_REST_URL }));
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

app.use('/user', userRouter);
app.use('/group', groupRouter);

const PORT = 7777;
const server = app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use.`);
    process.exit(1);
  }
});
const wss = new WebSocketServer({ server });

new WebSocketManager(wss);
