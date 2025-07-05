import mongoose, {Schema} from "mongoose";

const postSchema=new Schema({

    title:{
        type:String,    
        required:[true,"Title is required"],
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        maxlength:[500,"Description must be less than 500 characters"]
    },
    coverImage:{
        type:String,
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

},{timestamps:true});

const Post=mongoose.model("Post",postSchema);
export default Post;