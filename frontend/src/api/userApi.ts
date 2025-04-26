import configAxios from "../services/axiosConfig";

import { 
    LoginFormData 
} from "../types/types";

export const loginUser = (payload: LoginFormData) => {
    return configAxios.post("/api/login", payload);
};