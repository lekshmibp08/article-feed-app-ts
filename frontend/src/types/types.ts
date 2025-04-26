export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  preferences: Array<"Sports" | "Politics" | "Technology" | "Space" | "Health" | "Entertainment" | "Science" | "Business">;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
}