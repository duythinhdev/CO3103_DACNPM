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

router?.route('/login').post(login);
router?.route('/register').post(register);
router?.route('/logout').post(logout);
router?.route('/profile').get(profile);
router?.route('/list').get(list);

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