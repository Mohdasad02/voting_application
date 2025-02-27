const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//define person schema
const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  age : {
    type : Number,
    required : true
  },
  mobile : {
    type : String        
  },
  aadharCardNumber : {
    type : String,
    required : true,
    unique : true
  },
  password : {      
    type : String,
    required : true
  },
  address : {
    type : String,
    required : true
  },
  role : {
    type : String,
    enum : ['voter','admin'],
    default : 'voter'
  },
  isVoted : {
    type : Boolean,
    default : false 
  }
});


userSchema.pre('save', async function(next) {

  const user = this;
  if(!user.isModified('password')) return next(); //if we did not want to modify password (ex we have to modify salary or other things)

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password,salt);
    user.password = hashedPassword;
    next();
  }
  catch(err) {
    return next(err);
  }
})     
            
userSchema.methods.comparePassword = async function(userPassword){
  try{
      // Use bcrypt to compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(userPassword, this.password);
      return isMatch;
  }catch(err){
      throw err;       
  }
}


const User = mongoose.model('User',userSchema);
module.exports = User; 