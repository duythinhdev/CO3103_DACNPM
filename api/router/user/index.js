const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
    login,
    register,
    logout,
    profile,
    list
} = require('../../controller/user');

const ROUTER_API = {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    LIST: '/list',
};

router?.route(ROUTER_API?.LOGIN).post(login);
router?.route(ROUTER_API?.REGISTER).post(register);
router?.route(ROUTER_API?.LOGOUT).post(logout);
router?.route(ROUTER_API?.PROFILE).get(profile);
router?.route(ROUTER_API?.LIST).get(list);

// router?.route("/google/login/failed").get( (req, res) => {
//     console.log("res",res);
//     res.status(401).json({
//         success: false,
//         message: "failure",
//     });
// });
// router.route("/google").get(passport.authenticate("google", { scope: ["profile"] }));
// router.route("/google/callback").get(
//     passport.authenticate("google", {
//         successRedirect: CLIENT_URL,
//         failureRedirect: "user/google/login/failed",
//     })
// );

module.exports = router;