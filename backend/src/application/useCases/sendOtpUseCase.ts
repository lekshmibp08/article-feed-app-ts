import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { sendEmail } from "../../infrastructure/database/services/emailService"; 

export const sendOtpUseCase = async (
  email: string,
  phone: string,
  userRepository: IUserRepository,
  otpRepository: IOtpRepository
) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw { statusCode: HttpStatusCode.BAD_REQUEST, message: "Email already exists!" };
  }
  
  const existingPhone = await userRepository.findByPhone(phone);
  if (existingPhone) {
    throw { statusCode: HttpStatusCode.BAD_REQUEST, message: "Phone number already exists!" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log('Generated OTP:', otp);

  await otpRepository.createOtp({
    email,
    otp,
    expiresAt: new Date(Date.now() + 1 * 60 * 1000),
  });

  await sendEmail(
    email,
    'Your OTP for Signup Verification',
    `Your OTP is ${otp}. It expires in 60 seconds.`
  );

  return { message: "OTP sent successfully" };
};
