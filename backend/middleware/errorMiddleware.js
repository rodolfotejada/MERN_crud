const errorHandler = (err, req, res, next) => {
  //step 1
  const statusCode = res.statusCode ? res.statusCode : 500;

  //step 2
  res.status(statusCode);

  //step 3
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
