import bcrypt from "bcrypt";
import { IUserUseCases } from "./interfaces/IUserUseCase";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUser } from "../../domain/entities/IUser";
import { HttpStatusCode } from "../../enums/HttpStatusCode";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwtUtils";
import { Types } from "mongoose";

export class UserUseCases implements IUserUseCases {
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
      throw {
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Invalid credentials",
      };
    }

    const token = generateAccessToken({ id: user._id, email: user.email });

    const refreshToken = generateRefreshToken({
      id: user._id,
      email: user.email,
    });

    const safeUser = await this.userRepository.findById(user._id);
    if (!safeUser) {
      throw {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "User data retrieval failed",
      };
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
      phone?: string;
    }
  ): Promise<IUser | null> {
    const updatedUser = await this.userRepository.updateUser(
      userId,
      personalInfo
    );
    return updatedUser;
  }
  async resetPassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!userId || !currentPassword || !newPassword) {
      throw {
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Missing required fields",
      };
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw {
        statusCode: HttpStatusCode.NOT_FOUND,
        message: "User not found",
      };
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw {
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Current password is incorrect",
      };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUser(userId, {
      password: hashedPassword,
    });
  }
  async updatePreferences(
    userId: string,
    preferences: any
  ): Promise<IUser | null> {
    const updatedUser = await this.userRepository.updateUser(userId, {
      preferences,
    });
    return updatedUser;
  }
}
