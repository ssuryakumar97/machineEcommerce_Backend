const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//REGISTER

router.post("/register", async (req, res) => {
  try {
  const { firstName, lastName, username, email, password } = req.body;
  // console.log(firstName)
  const oldUser = await User.findOne({email})
  if(oldUser){
    return res.status(400).json({message: "User already exists please signin"})
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ firstName, lastName, username, email, password: hashedPassword });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(401).json({ message: "Password wrong, please check" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const {...others } = user._doc;
    res.status(200).json({  ...others, accessToken });
  } catch (err) {
    res.status(500).send(err);
    //  Catching error of user and wrong password please check with the guvi team
  }
});

module.exports = router;
