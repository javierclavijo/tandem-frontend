import { User } from "../../../common/types";

export interface AuthContextType {
  user: User | undefined;
  error: string;
  loading: boolean;
  isLoggedIn: boolean;
  login: (requestData: LogInRequestData) => Promise<void>;
  logout: () => void;
}

export type LogInRequestData = {
  username: string;
  password: string;
};
