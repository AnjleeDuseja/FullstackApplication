import multer from "multer"


const diskStorage=multer.diskStorage({
destination: function(req,file,callBack){
    callBack(null, "../../public/temp")
},
filename: function(req, file, callBack){
    callBack(null, file.originalname)

}
})

export const upload=multer({
   diskStorage
})