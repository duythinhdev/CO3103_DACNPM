const express = require('express');
const router = express.Router();
const { message } = require("../../controller/message");

router?.route('/:userId').get(message);


module.exports = router;