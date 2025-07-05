import mongoose, {Schema} from "mongoose";

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
    refreshToken:{
        type:String,
        default:""
    },
},{timestamps:true});

const User=mongoose.model("User",userSchema);
export default User;