
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { APIError } from './APIError';

// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

export const UploadFileonCloudinary= async(localPath)=> {

    try{
        if(!localPath) return null
         const uploadResult= await cloudinary.uploader.upload(localPath,{resource_type: "auto"})
         console.log(`uploadResult: ${uploadResult}`)
         return uploadResult
    }
    catch (error){
        fs.unlinkSync(localPath)
          return new APIError(501,"Error while uploading file to cloudinary!")
    }

}

