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
      //step 1: get the token from headers:
      token = req.headers.authorization.split(' ')[1];

      //step 2: verify token:
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //step 3: find the user in DB with id encrypted in the token.
      //step 4: then save the user as 'req.user', this obj will be available in all protected routes.
      req.user = await User.findById(decoded.id).select('-password'); //.select() method: will remove specific data.

      //finished, move on with next...
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
