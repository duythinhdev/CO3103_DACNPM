const express = require('express');
const router = express.Router();
const { message } = require("../../controller/message");

const ROUTER_API = {
    DETAIL: '/:userId'
};
router?.route(ROUTER_API?.DETAIL).get(message);

module.exports = router;