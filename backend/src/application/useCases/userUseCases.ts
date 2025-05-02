import bcrypt from 'bcrypt';
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../../domain/entities/IUser";
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { 
    generateAccessToken, 
    generateRefreshToken 
} from "../../utils/jwtUtils";
import { Types } from 'mongoose';

export class UserUseCases {
  constructor(private userRepository: IUserRepository) {}

  async login(
    identifier: string, 
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    userData: IUser;
  }> {
    const user =
      (await this.userRepository.findByEmail(identifier)) ||
      (await this.userRepository.findByPhone(identifier));

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw {statusCode: HttpStatusCode.UNAUTHORIZED, message:"Invalid credentials"};
    }

    const token = generateAccessToken({ id: user._id, email: user.email });

    const refreshToken = generateRefreshToken({ id: user._id, email: user.email });

    const safeUser = await this.userRepository.findById(user._id);
    if (!safeUser) {
        throw {statusCode: HttpStatusCode.NOT_FOUND, message:"User data retrieval failed"};
    }

    return {
      token,
      refreshToken,
      userData: safeUser,
    };
  }
  async updatePersonalInfo(
    userId: string | Types.ObjectId,
    personalInfo: {
      firstName?: string; 
      lastName?: string; 
      email?: string; 
      phone?: string
    }
  ): Promise<IUser | null> {
    const updatedUser = await this.userRepository.updateUser(userId, personalInfo);
    return updatedUser;
  }   
}