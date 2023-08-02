const express = require('express');
var router = express.Router();
const {
    login,
    register,
    logout,
    profile,
    people
} = require('../../controller/user/index')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);
router.route("/profile").get(profile);
router.route("/people").get(people);

module.exports = router;