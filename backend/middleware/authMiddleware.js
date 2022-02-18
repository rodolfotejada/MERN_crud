const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //get the token from headers:
      token = req.headers.authorization.split(' ')[1];

      //verify token:
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //get the user from the DB, and assign it to req.user (this will be available on every protected route):
      req.user = await User.findById(decoded.id).select('-password');

      //process finished, move on with next...
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
