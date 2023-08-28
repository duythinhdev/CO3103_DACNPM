const express = require('express');
const router = express.Router();
const {create} = require('../../controller/group/index')

router?.route("").post(create);

module.exports = router;