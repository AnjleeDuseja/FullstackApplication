import { Router } from "express";
import { generateNewAccessToken, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"
import { jwtVerify } from "../middlewares/authMiddleware.js";
const router=Router();

router.route("/register").post(
    upload.single('profile'),
    registerUser);

    
router.route("/login").post(
    loginUser);
    
router.route("/logout").post(jwtVerify,
    logoutUser);

    
router.route("/refresh-token").post(
    generateNewAccessToken);

export default router;