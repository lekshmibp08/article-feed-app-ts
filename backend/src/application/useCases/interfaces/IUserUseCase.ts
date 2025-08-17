import { Types } from "mongoose";
import { IUser } from "../../../domain/entities/IUser";

export interface IUserUseCases {
  login(
    identifier: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    userData: IUser;
  }>;
  updatePersonalInfo(
    userId: string | Types.ObjectId,
    personalInfo: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<IUser | null>;

  resetPassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;

  updatePreferences(userId: string, preferences: any): Promise<IUser | null>;
}
