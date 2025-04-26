import User from '../models/userSchema.js'
import Otp from '../models/otpSchema.js'
import { sendEmail } from '../services/emailService.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export const sendOtp = async (req, res, next) => {
    const { email, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next({ statusCode: 400, message: "Email already exists!" });
        }
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return next({ statusCode: 400, message: "Phone number already exists!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log('OTP : ', otp);

        const otpEntity = new Otp({
          email,
          otp,
          expiresAt: new Date(Date.now() + 1 * 60 * 1000), // OTP expires in 15 minutes
        });
        await otpEntity.save();

        await sendEmail(
            email, 
            'Your OTP for Signup Verification', 
            `Your OTP is ${otp}. It expires in 60 seconds.`
        );
        

        res.status(200).json({ message: "OTP sent successfully" });

    } catch (error) {
        next(error);
    }
};
export const verifyOtpAndRegisterUser = async (req, res, next) => {
    const { email, otp, firstName, lastName, phone, password, preferences } = req.body;

    try {
        const otpExists = await Otp.findOne({ email, otp });
        if(!otpExists || new Date() > otpExists.expiresAt ) {
            return next({ statusCode: 400, message: "Invalid or expired OTP"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName, lastName, email, phone, password: hashedPassword, preferences
        })

        await Otp.deleteOne({ email });
        
        res.status(201).json({ message: "OTP verified and User registered successfully, You can now log in..!"});

    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    const { email, phone, password } = req.body;
    const user = await User.findOne({ 
        $or: [{ email }, { phone }] 
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next({
            statusCode: 400, message: "Invalid credentials"
        });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } 
    );

    const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" } 
    );

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userData = await User.findById(user._id).select("-password");

    res.status(200).json({ message: "Login successful", token, userData });

}

