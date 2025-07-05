import { Router } from "express";
import { registerUser, trial } from "../controllers/user.controller.js";

const router=Router();

router.route("/register").post(registerUser);

router.route("/").get(trial)
export default router;