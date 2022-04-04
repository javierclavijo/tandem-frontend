import React, {useContext, useMemo, useState} from "react";
import {loginRequest, LogInRequestData} from "./services/authApi";

interface AuthContextType {
    token: string;
    error: string;
    loading: boolean;
    login: (requestData: LogInRequestData) => void;
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const login = async (data: LogInRequestData) => {
        try {
            setLoading(true);
            const token = await loginRequest(data);
            setToken(token);
        } catch (e) {
            setError("Incorrect username or password.");
        } finally {
            setLoading(false);
        }
    };

    const memoedValue = useMemo(() => ({
            token,
            login,
            error,
            loading
        }),
        [token, error, loading]);

    return (
        <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}

// Code inspired by https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10
// and https://lo-victoria.com/introduction-to-react-context-api-with-firebase-authentication