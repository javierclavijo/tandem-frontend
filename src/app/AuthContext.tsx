import React, {useContext, useMemo, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {useMutation} from "react-query";

interface AuthContextType {
    token: string;
    error: string;
    loading: boolean;
    isLoggedIn: boolean;
    login: (requestData: LogInRequestData) => void;
}

export type LogInRequestData = {
    username: string,
    password: string
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const axiosApi = axios.create();

export function AuthProvider({children}: { children: React.ReactNode }) {

    const [token, setToken] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    const loginRequest = async (data: LogInRequestData) => {
        const url = `${process.env.REACT_APP_API_URL as string}/api-token-auth/`;
        const response = await axiosApi.post(url, data);
        return response.data;
    };

    const loginQuery = useMutation(loginRequest, {
        onSuccess: async (data) => {
            setToken(data.token);
            setIsLoggedIn(true);
        }
    });

    const login = async (data: LogInRequestData) => {
        setLoading(true);
        try {
            await loginQuery.mutateAsync(data);
        } catch (e) {
            setError("Incorrect username or password.");
        } finally {
            setLoading(false);
        }
    };


    React.useEffect(() => {
        if (token) {
            // add authorization token to each request
            axiosApi.interceptors.request.use(
                (config: AxiosRequestConfig): AxiosRequestConfig => {
                    config.baseURL = process.env.REACT_APP_API_URL;
                    config.headers!.authorization = `Token ${token}`;
                    return config;
                }
            );

            axiosApi.interceptors.response.use(
                (response) => response,
                async (error) => {
                    return Promise.reject(error);
                }
            );
        }

    }, [token]);

    const memoedValue = useMemo(() => ({
            token,
            login,
            error,
            loading,
            isLoggedIn,
        }),
        [token, error, loading, isLoggedIn]);

    return (
        <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}

// Code inspired by https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10,
// https://lo-victoria.com/introduction-to-react-context-api-with-firebase-authentication
// and https://egreb.net/blog/react-auth-with-react-query-and-axios/
