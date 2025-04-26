import express from "express";
import { 
    sendOtp,
    verifyOtpAndRegisterUser,
    userLogin 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-and-register", verifyOtpAndRegisterUser);
router.post("/login", userLogin);

export default router;
