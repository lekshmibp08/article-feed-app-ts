import configAxios from "../services/axiosConfig";

import { 
    LoginFormData,
    IUser, 
    IPersonalInfo,
    IPasswordChange,
    Category,

} from "../types/types";

export const loginUser = (payload: LoginFormData) => {
    return configAxios.post("/api/login", payload);
};

export const sendOtp = (values: { email?: string; phone?: string }) => {
  return configAxios.post("/api/send-otp", values);
};

export const verifyAndRegister = (values: Partial<IUser>) => {
  return configAxios.post("/api/verify-and-register", values);
};

export const updatePersonalInfo = (personalInfo: IPersonalInfo) => {
  return configAxios.patch("/api/users/update-profile", personalInfo);
};

export const changeUserPassword = (passwordInfo: IPasswordChange) => {
  return configAxios.patch("/api/users/change-password", passwordInfo);
};

export const updateUserPreferences = (preferences: any) => {
  return configAxios.patch("/api/users/update-preferences", { preferences });
};

