import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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
    isPosted:{
        type: Boolean,
        default:true
    },
    views:{
        type:Number,
        default:0,
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

},{timestamps:true});

postSchema.plugin(mongooseAggregatePaginate)

const Post=mongoose.model("Post",postSchema);
export default Post;