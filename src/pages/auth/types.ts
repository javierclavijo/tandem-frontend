import { LabelOption } from "../../common/components/Select/types";
import { LogInRequestData } from "../../common/context/AuthContext/types";

export interface RegisterRequestData extends LogInRequestData {
  email: string;
  nativeLanguages: string[];
}

export interface RegisterFormValues extends LogInRequestData {
  email: string;
  nativeLanguages: LabelOption[];
  confirmPassword: string;
}
