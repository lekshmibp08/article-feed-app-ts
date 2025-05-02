import { IOtp } from "../../domain/entities/IOpt"; 

export interface IOtpRepository {
  createOtp(otp: IOtp): Promise<IOtp>;
  findOtp(email: string, otp: string): Promise<IOtp | null>;
  deleteOtpByEmail(email: string): Promise<void>;
}
