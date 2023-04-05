const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');


dotenv.config();
const bcryptSalt = bcrypt.genSaltSync(10);

router.get('/', (req, res) => {
  res.json('test')
});

const jwtSecrete = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecrete, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
        id: createdUser._id,
      });
    });
  } catch (err) {
    if (err) throw err;
    res.status(500).json('error');
  }
});

router.post('/login', async (req,res) => {
  const {username, password} = req.body;
  const foundUser = await User.findOne({username});
  if (foundUser) {
    const passOk = bcrypt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign({userId:foundUser._id,username}, jwtSecrete, {}, (err, token) => {
        res.cookie('token', token, {sameSite:'none', secure:true}).json({
          id: foundUser._id,
        });
      });
    }
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecrete, {}, (err, data) => {
        if (err) throw err;
        res.json(data)
      })
    }else{
      res.status(401).json('no token');
    }
  } catch (err) {
    console.log(err)
  }
})



module.exports = router;