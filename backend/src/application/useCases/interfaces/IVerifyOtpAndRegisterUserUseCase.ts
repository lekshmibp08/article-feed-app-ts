import { IUser } from "../../../domain/entities/IUser";

export interface IVerifyOtpAndRegisterUserUseCase {

  execute(userData: IUser & { otp: string }): Promise<{message: string}> 
  
}
