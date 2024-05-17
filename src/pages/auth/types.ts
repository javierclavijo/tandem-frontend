import { LogInRequestData } from "../../common/context/AuthContext/types";
import { Option } from "../../common/types";

export interface RegisterRequestData extends LogInRequestData {
  email: string;
  nativeLanguages: string[];
}

export interface RegisterFormValues extends LogInRequestData {
  email: string;
  nativeLanguages: Option[];
  confirmPassword: string;
}
