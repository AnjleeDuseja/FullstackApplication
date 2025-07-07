import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const userSchema=new Schema({

    name:{
        type:String,
        unique:[true,"Name must be unique"],
        required:[true,"Name is required"],
        trim:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        required:[true,"Password is required"],
        unique:[true,"this email is already registered"],
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:8
    },
    profile:{
        type:String,
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post",
        }
    ],
    refreshToken:{
        type:String,
        default:""
    },
},{timestamps:true});



//function to encrypt password before saving to database using bcrypt
userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password, 12);
    next();
})


userSchema.methods.verifyPassword=async function(password) {
   return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken= function(){
    
  return  jwt.sign(
        {
        _id:this._id,
        email: this.email
        
    },
     process.env.ACCESS_TOKEN,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      })
}


userSchema.methods.generateRefreshToken= function(){
    
   return jwt.sign(
        {
        _id:this._id,
    },
     process.env.REFRESH_TOKEN,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      })
}

const User=mongoose.model("User",userSchema);
export default User;