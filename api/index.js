const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { WebSocketServer } = require("ws");
const Database = require('../api/mongodb/index');
require('./util/passport');
const userRouter = require('../api/router/user/index');
const messageRouter = require('../api/router/message');
const groupRouter = require('../api/router/group/index');
const WebSocketManager = require('./wss/WebSocketManager');

dotenv.config();

const app = express();
Database.connect();
app.use(cors({ credentials: true, origin: process.env.VITE_APP_REST_URL }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.use('/messages', messageRouter);
app.use('/user', userRouter);
app.use('/group', groupRouter);