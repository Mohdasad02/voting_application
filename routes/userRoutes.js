const express = require('express');
const router = express.Router();
const User = require('./../models/user.js');
const { generateToken,jwtAuthMiddleware } = require('./../jwt');


 //create
 router.post('/signup', async (req,res) => {     

  try{
    const data = req.body;
    
    // Check if there is already an admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (data.role === 'admin' && adminUser) {
        return res.status(400).json({ error: 'Admin user already exists' });
    }

     const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

    const newUser = new User(data); //it create an instance for newUser
    const response = await newUser.save();
    console.log(response);
    
    const payLoad = {
      id : response.id          
    } 

    // console.log(payload.id); 

    const token = generateToken(payLoad);         
    console.log("Token is :",token);            

    res.status(200).json(response);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({error : 'Internal server errorrrrr'});
  }
  
});

router.post('/login', async (req,res) => {
   
  try{
    console.log("Before checking");
    const {aadharCardNumber,password} = req.body;
    const user = await User.findOne({aadharCardNumber : aadharCardNumber});

    console.log("After aadhar matches");

    if(!user || !(await user.comparePassword(password))) {                       
     return res.status(401).json({error : 'Invalid username or password'});
    }

    console.log("After password check");

    const payLoad = {
      id : user.id
    }                                                 
    const token = generateToken(payLoad);
    console.log(token);

    res.status(200).json(token);
    
  }
  catch(err) {
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }
})


//profile route
router.get('/profile',jwtAuthMiddleware,  async (req,res) => {
  
  try {
  const userData = req.user;
  const userId = userData.id;                        
  const user = await User.findById(userId); 
  res.status(200).json({user});
  }
  catch(err) {
    res.status(500).json({error : 'Internal server errorrr'});
  }

});


//read
// router.get('/:workType', async (req,res) => {
//   try {
//     const workType = req.params.workType;//workType will be extracted from url route workType
//     if(workType == 'chef' || workType == 'manager' || workType == 'waiter') {
//       const response = await Person.find({ work: workType});
//       console.log("Fetched successfully");
//       res.status(200).json(response);
//     }
//     else {
//       res.status(404).json({error : 'Invalid work type'});
//     }
//   }
//   catch(err) {
//     console.log(err);
//     res.status(500).json({error : 'Internal server error'}); 
//   }
// })

//update
router.put('/profile/password',jwtAuthMiddleware , async (req,res) => {

  try {
    const userId = req.user; 
    const {currentPassword,newPassword} = req.body;

    const user = await User.findById(userId);

    if(!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({error : 'Incorrect password'});
    }

    user.password = newPassword;
    await user.save();

  
    console.log("Password updated");
    res.status(200).json({message : 'Password updated'});
  }

  catch(err) {
    console.log(err);
    res.status(500).json({error : 'Internal server error'});
  }

})

//delete
// router.delete('/:id', async (req,res) => {

//   try {
//     const personId = req.params.id;
//     const updatedPersonId = req.body;

//     const response  = await Person.findByIdAndDelete(personId,updatedPersonId, {
//       new : true, //save the new updated data
//       runValidators : true //also run the validators means required true or uniq 
//     }) 
//     if(!response) {
//       return res.status(404).json({error : "Page not found"});
//     }
//     console.log("Data updated");
//     res.status(200).json(response);
//   }

//   catch(err) {
//     console.log(err);
//     res.status(500).json({error : 'Internal server errorrrr'});
//   }

// })


module.exports = router; 