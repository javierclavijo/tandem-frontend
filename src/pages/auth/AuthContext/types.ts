import { AxiosResponse } from "axios";
import { User } from "../../../common/types";

export interface AuthContextType {
  user: User | undefined;
  error: string | undefined;
  loading: boolean;
  isLoggedIn: boolean;
  login: (requestData: LogInRequestData) => Promise<AxiosResponse<void>>;
  logout: () => Promise<AxiosResponse<void>>;
}

export type LogInRequestData = {
  username: string;
  password: string;
};

export interface SessionInfoResponse {
  id: string | null;
  url: string | null;
}
