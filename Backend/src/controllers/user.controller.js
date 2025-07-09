import User from "../models/user.model.js"
import { APIError } from "../utils/APIError.js"
import { APIResponse } from "../utils/APIResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { UploadFileonCloudinary } from "../utils/Cloudinary.js"
import  jwt  from "jsonwebtoken";


//function to generate tokens 
  const generateTokens= async function(id){
    
    const user=await User.findById(id);
    const refreshToken=user.generateRefreshToken();
    const accessToken= user.generateAccessToken();

    user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});
    return {accessToken, refreshToken};

  }


const registerUser= asyncHandler(async (req, res)=>{

    const {name, email, password }=req.body
  
//checking if required fields are empty
   const data= [name, email, password].filter((data)=> data.trim()==="")
   
   if(data.length>0){
    throw new APIError(402, "Username, email and password are required!")
   }

//check if username or email already exist

    const existedUser= await User.findOne({
      $or:[{name},{email}]
    });

     if(existedUser){
      throw new APIError(404, "username or email is already registered!")
    }


    const profileLocalPath=req.file?.path

    if(!profileLocalPath){
      throw new APIError(403, "Profile picture is required!")
    }

    const profileUrl=await UploadFileonCloudinary(profileLocalPath);

    if(!profileUrl)
      throw new APIError(402, "Profile picture is required!")

    //creating user object to save it in database
    const user=  await User.create({
      name,
      email,
      password,
      profile:profileUrl.url
    })
// checking if user saved
    const createdUser= await User.findById(user._id).select("-password -refreshToken")
    console.log(createdUser)

    if(!createdUser)
      throw new APIError(501,"Failed to register user")

  return  res.status(200).json(
    new APIResponse(200, "User registered successfully!", createdUser)
  )

})

const loginUser = asyncHandler( async (req,res)=>{

  const {name, email, password }=req.body


  

  // checking if user provided username or email
  if(!(name || email)){
    throw new APIError(400,"Username or Email is required!")

  }

  
  // checking if user provided password
  if(!password){
    
    throw new APIError(400,"Password is required!")
  }


//checking if user existed in database
 const userInstance=await User.findOne({
    $or:[{name},{email}]
  })


  if(!userInstance){
    throw new APIError(401,"incorrrect credentials!")
  }

  //verifying the password if user entered correct password
  const verifiedPassword=await userInstance.verifyPassword(password)

  if(!verifiedPassword){
    throw new APIError(401,"incorrrect credentials!")

  }


  // if user name and password is correct generate tokens 

  const {refreshToken, accessToken}=await generateTokens(userInstance._id)


//getting updated user as refreshToken is added and removing the password and refreshToken 
  const updatedUser= await User.findById(userInstance._id)
  .select("-password -refreshToken")
 
   const options={
    httpOnly:true,
    secure: true
  }

  //returning user data and tokens in cookie and object 
  return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new APIResponse(200, "User loggedin successfully!", {user:updatedUser, refreshToken, accessToken}))


})

const logoutUser =asyncHandler(async (req, res)=>{
  const user=req.user

  await User.findByIdAndUpdate(user._id,
    {
    $set:{ 
      refreshToken:undefined
    }
  },
{
  new:true
}
)

  const options={
    httpOnly:true,
    secure: true
  }
  return res.status(200).clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new APIResponse(200, "logout successfully!", {}))
})

const generateNewAccessToken= asyncHandler( async (req, res)=>{

  try{
   const token=req.cookies.refreshToken || req.body;
    if(!token){
             throw new APIError(401,"no valid refresh Token!")
        }
        
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN)

        const user= await User.findById(decoded._id)

        if(!(token===user.refreshToken)){
            throw new APIError(401,"no valid refresh Token!")

        }

        const {accessToken, refreshToken} = await generateTokens(decoded._id)
  
      const updatedUser= await User.findById(decoded._id)
      .select("-password -refreshToken ")
 
   const options={
    httpOnly:true,
    secure: true
  }
  
        return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new APIResponse(200, "token refreshed!", {user:updatedUser, refreshToken, accessToken}))
        


  }
  catch(err){
    throw new APIError(401, "Error while generating access token")
  }


})

const updateProfile = asyncHandler(async (req, res)=>{


    const userId=req.user?._conditions?._id;
    const profileLocalPath=req.file?.path
 

    if(!profileLocalPath){
      throw new APIError(403, "Profile picture is required!")
    }

    const profileUrl=await UploadFileonCloudinary(profileLocalPath);

    if(!profileUrl)
      throw new APIError(402, "Profile picture is required!")

    await User.findByIdAndUpdate(userId,{
        $set:{profile: profileUrl.url}
      },
    {new:true}
    )
const updatedUser = await User.findById(userId).select("-password -refreshToken")
   

     return  res.status(200).json(
    new APIResponse(200, "profile updated successfully!", updatedUser)
  )
    

})

const updatePassword= asyncHandler(async (req, res)=>{

const {oldPassword, newPassword}=req.body;  


const userId=req.user?._conditions?._id;
const user=await User.findById(userId);

const passwordCheck=user.verifyPassword(oldPassword)

if(!passwordCheck)
  throw new APIError(401, "Old password is incorrect")


  user.password=newPassword; 
  await  user.save({validateBeforeSave:false});
    
  const updatedUser = await User.findById(user._id).select("-password -refreshToken")
   
     return  res.status(200).json(
    new APIResponse(200, "Password updated!", updatedUser))


})


export {registerUser, loginUser, logoutUser, generateNewAccessToken, updateProfile, updatePassword}