import { IVerifyOtpAndRegisterUserUseCase } from "./interfaces/IVerifyOtpAndRegisterUserUseCase";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import bcrypt from "bcrypt";
import { IUser } from "../../domain/entities/IUser";

export class verifyOtpAndRegisterUserUseCase implements IVerifyOtpAndRegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async execute(userData: IUser & { otp: string }) {
    const { email, otp, password } = userData;

    const otpExists = await this.otpRepository.findOtp(email, otp);
    if (!otpExists || new Date() > otpExists.expiresAt) {
      throw {
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Invalid or expired OTP",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    await this.otpRepository.deleteOtpByEmail(email);

    return {
      message:
        "OTP verified and User registered successfully, You can now log in..!",
    };
  }
}
