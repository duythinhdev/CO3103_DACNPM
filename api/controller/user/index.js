const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtSecret,
        {},
        (err, token) => {
          res.cookie("token", token, { sameSite: "none", secure: true }).json({
            id: foundUser._id,
          });
        },
      );
    }
  }
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createdUser._id,
          });
      },
    );
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ error: err });
  }
};

exports.logout = (req, res) => {
  // req.session?.regenerate((err) => {
  //     if (err) {
  //         console.error('Error regenerating session:', err);
  //     }
  //     res.redirect('/');
  // });
  res.cookie("token", "", { sameSite: "none", secure: true }).json("ok");
};

exports.profile = (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
};

exports.people = async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  try {
    res.json(users);
  } catch (e) {
    res.json({ error: e });
  }
};
