import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../infrastructure/database/repository/UserRepository'; 
import { OtpRepository } from '../../infrastructure/database/repository/OtpRepository';
import { sendOtpUseCase } from '../../application/useCases/sendOtpUseCase'; 
import { verifyOtpAndRegisterUserUseCase } from '../../application/useCases/verifyOtpAndRegisterUserUseCase '; 
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { UserUseCases } from '../../application/useCases/userUseCases';

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();
const userUseCases = new UserUseCases(userRepository);

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone } = req.body;
    const result = await sendOtpUseCase(email, phone, userRepository, otpRepository);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpAndRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await verifyOtpAndRegisterUserUseCase(userData, userRepository, otpRepository);
    res.status(HttpStatusCode.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, phone, password } = req.body;

    const identifier = email || phone;
    if (!identifier || !password) {
      throw {
        statusCode: HttpStatusCode.BAD_REQUEST, 
        message:"Missing credentials"
      };
    }

    const { token, refreshToken, userData } = await userUseCases.login(identifier, password);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatusCode.OK).json({
      message: "Login successful",
      token,
      userData,
    });

  } catch (error) {
    next(error);
  }
};


