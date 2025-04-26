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

export interface LoginFormData {
  email: string;
  phone: string;
  password: string;
}

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface IPasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
  