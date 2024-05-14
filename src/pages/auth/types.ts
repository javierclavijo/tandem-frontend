import { Option } from "../../common/types";
import { LogInRequestData } from "./AuthContext/types";

export interface RegisterRequestData extends LogInRequestData {
  email: string;
  nativeLanguages: string[];
}

export interface RegisterFormValues extends LogInRequestData {
  email: string;
  nativeLanguages: Option[];
  confirmPassword: string;
}
