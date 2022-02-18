const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

//REGISTER NEW USER:
const registerUser = asyncHandler(async (req, res) => {
  //step 1 (GET DATA FROM REQ)
  const { name, email, password } = req.body;

  //step 2 (VALIDATE THE DATA)
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please complete all fields!');
  }

  //step 3 (VERIFY IF USER EXISTS ALREADY)
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exist!');
  }

  //step 4 (HASHED PASSWORD)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //step 5 (CREATE NEW USER)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  //step 6 (RESPONSE FROM DB)
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//AUTH A USER:
const loginUser = asyncHandler(async (req, res) => {
  //step 1(RECEIVE THE DATA)
  const { email, password } = req.body;

  //step 2 (FIND THE USER)
  const user = await User.findOne({ email });

  //step 3 (COMPARE PASSWORD WITH BCRYPT)
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

//GET USER INFO (SET TO PRIVATE)
const getUser = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);

  res.status(200).json({
    id: _id,
    name,
    email,
  });
});

//GENERATE TOKEN:
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
