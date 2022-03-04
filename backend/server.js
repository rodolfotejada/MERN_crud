const path = require('path');
const express = require('express');
const colors = require('colors');
const { CHAR_UPPERCASE_Z } = require('picomatch/lib/constants');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;

//MongoDB connection:
connectDB();

//Setting app with Express:
const app = express();

//JSON setup:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes setup:
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

//Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

//Error handler setup:
app.use(errorHandler);

//App running message:
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
