export interface ISendOtpUseCase {
  execute(email: string, phone: string): Promise<{ message: string }>;
}
