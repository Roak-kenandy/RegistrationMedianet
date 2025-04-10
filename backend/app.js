const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const registerProfileRoutes = require('./routes/registerProfileRoutes');
const compression = require('compression');

const app = express();

// Enable CORS for all routes
app.use(cors());

//Middleware to parse JSON
app.use(express.json());    //This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

//Connect to MongoDB Atlas
connectDB();


app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  })
)

//Define a routes
app.use('/api/v1', registerProfileRoutes);

//Default route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;