// initialize ExpressJs application and Importing nessesary modules
const express = require('express');
const router = require('./src/routes/api');
const app = new express();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const expressMongoSanitizer = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

// API rate limiting Configuration -> 1000 requests per 5 miniutes
const limiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 1000 });

// Implementation of security packages
app.use(cookieParser());
app.use(cors());
app.use(hpp());
app.use(helmet());
app.use(xssClean());
app.use(expressMongoSanitizer());
app.use(limiter);

// Limiting Json upload to 40mb maximum
app.use(express.json({ limit: '40mb' }));
app.use(express.urlencoded({ limit: '40mb' }));

// Establish database connection -> Connect to MongoDB
const mongoose = require('mongoose');
const URI = 'mongodb+srv://itzthorxd:Rayhan7291@clusterecommerceproject.pre0ctu.mongodb.net/Ecommerce';
const Options = { autoIndex: true };

mongoose
   .connect(URI, Options)
   .then(res => {
      console.log('MongoDB Server Connection Established Successfully!');
   })
   .catch(err => console.error(err));

// App using specified routes
app.use('/api/v1/', router);

// Handle undefined routes requests
app.get('*', (req, res) => {
   res.status(404).json({ status: 'Fail', data: 'Data not found!' });
});

module.exports = app;
