
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { APIError } from './APIError.js';

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

 const UploadFileonCloudinary= async(localPath)=> {

    try{
        if(!localPath) return null
         const uploadResult= await cloudinary.uploader.upload(localPath,{resource_type: "image"})
         
         fs.unlinkSync(localPath)
         return uploadResult
    }
    catch (error){
        fs.unlinkSync(localPath)
          throw new APIError(501,"Error while uploading file to cloudinary!")
    }

}

export {UploadFileonCloudinary}
