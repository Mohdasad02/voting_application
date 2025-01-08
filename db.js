const mongoose = require('mongoose');
require('dotenv').config();
const mongoUrl = process.env.MONGODB_URL_LOCAL//mongodb connec. URL
// const mongoUrl = process.env.MONGODB_URL;

//set up mongoDB connection
mongoose.connect(mongoUrl, {
 
})

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

//event listener for database connection
db.on('connected', () => {
  console.log('Connected to mongoDb server');
});

db.on('error', (err) => {
  console.error('MongoDb connection error :',err);
});

db.on('disconnected', () => {
  console.error('MongoDb server disconnected');
});

module.exports = db;

