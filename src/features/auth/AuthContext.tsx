import React, {useContext, useMemo, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {User} from "../../entities/User";

interface AuthContextType {
    token: string;
    user: User | undefined;
    error: string;
    loading: boolean;
    isLoggedIn: boolean;
    login: (requestData: LogInRequestData) => void;
    logout: () => void;
}

export type LogInRequestData = {
    username: string,
    password: string
}

export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const axiosApi = axios.create({baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000"});

export function AuthProvider({children}: { children: React.ReactNode }) {

    const queryClient = useQueryClient();

    const [token, setToken] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const authHeaderInterceptorRef = React.useRef<number | null>(null);


    const {data: user} = useQuery<User>(["users", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        enabled: isLoggedIn && !!url && !!id,
        staleTime: 15000,
    });

    React.useEffect(() => {
        // Fetch token, ID and URL from localStorage on init
        const token = localStorage.getItem("auth_token");
        const id = localStorage.getItem("user_id");
        const url = localStorage.getItem("user_url");
        if (token && id && url) {
            setToken(token);
            setId(id);
            setUrl(url);
            setIsLoggedIn(true);
        }
    }, []);

    const loginRequest = async (data: LogInRequestData) => {
        const url = `${process.env.REACT_APP_API_URL as string}/api-token-auth/`;
        const response = await axiosApi.post(url, data);
        return response.data;
    };

    const loginMutation = useMutation(loginRequest, {
        onSuccess: async (data) => {
            setToken(data.token);
            setId(data.id);
            setUrl(data.url);
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user_id", data.id);
            localStorage.setItem("user_url", data.url);
            setIsLoggedIn(true);
        }
    });

    const login = React.useCallback(async (data: LogInRequestData) => {
        setLoading(true);
        try {
            await loginMutation.mutateAsync(data);
        } catch (e) {
            setError("Incorrect username or password.");
        } finally {
            setLoading(false);
        }
    }, [loginMutation]);


    const logout = React.useCallback(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_url");
        setToken("");
        setIsLoggedIn(false);

        // On logout, remove the logged-in user query to avoid keeping the user's data in cache
        queryClient.removeQueries(["users", id], {exact: true});

        // Also, eject the Axios interceptor which appends the Authorization header
        const interceptor = authHeaderInterceptorRef.current;
        if (interceptor !== null) {
            axiosApi.interceptors.request.eject(interceptor);
        }
    }, [id, queryClient]);

    React.useEffect(() => {
        // Add auth header to requests when token is updated
        if (token) {
            // Add authorization token to each request, save the interceptor in a ref to be able to eject it on logout
            authHeaderInterceptorRef.current = axiosApi.interceptors.request.use(
                (config: AxiosRequestConfig): AxiosRequestConfig => {
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
            user,
            error,
            loading,
            isLoggedIn,
            login,
            logout
        }),
        [token, user, error, loading, isLoggedIn, login, logout]);

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
