const express = require('express');
const db = require('./db.js');   
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
require('dotenv').config(); 

// const passport = require('./auth.js');     
// app.use(passport.initialize());


const userRoutes = require('./routes/userRoutes.js');
app.use('/user',userRoutes); 

const candidateRoutes = require('./routes/candidateRoutes.js');
app.use('/candidate',candidateRoutes); 



const PORT = process.env.PORT || 8129;
app.listen(PORT , () => {
  console.log("Listening on port 8129");
})
