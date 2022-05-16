import React, {useContext, useMemo, useState} from "react";
import axios, {AxiosRequestConfig} from "axios";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {User} from "../../entities/User";
import Cookies from "js-cookie";


interface AuthContextType {
    csrfToken: string;
    user: User | undefined;
    error: string;
    loading: boolean;
    isLoggedIn: boolean;
    login: (requestData: LogInRequestData) => Promise<any>;
    logout: () => void;
}

export type LogInRequestData = {
    username: string,
    password: string
}


export const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const axiosApi = axios.create({baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:8000/api"});

export function AuthProvider({children}: { children: React.ReactNode }) {
    /**
     * Authentication context for the app. Fetches and provides information about authentication and the user, and provides functions to log in and log out.
     */

    const queryClient = useQueryClient();

    const [csrfToken, setCsrfToken] = useState<string>("");
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
            setCsrfToken(token);
            setId(id);
            setUrl(url);
            setIsLoggedIn(true);
        }
    }, []);

    /**
     * Fetches the current session's info from the server (user ID and URL, plus CSRF token from the csrftoken cookie) and sets it in the contexts state. Runs on init.
     */
    const fetchSessionInfo = React.useCallback(async () => {
        const response = await axiosApi.get('session_info/')
        debugger
        if (response.data.id && response.data.url) {
            setId(response.data.id)
            setUrl(response.data.url)
        }
        const cookie = Cookies.get('csrftoken')

        if (cookie) {
            setCsrfToken(cookie)
        }
    }, [])

    /**
     * On init, fetch session info and get the CSRF cookie.
     */
    React.useEffect(()=> {fetchSessionInfo()}, [fetchSessionInfo])

    const loginRequest = async (data: LogInRequestData) => {
        return await axiosApi.post("login/", data);
    };

    const loginMutation = useMutation(loginRequest);

    const login = React.useCallback(async (data: LogInRequestData) => {
        let response;
        debugger
        setLoading(true);
        try {
            response = await loginMutation.mutateAsync(data);    
            await fetchSessionInfo()
            setIsLoggedIn(true);
        } catch (e) {
            if (axios.isAxiosError(e) && e.response) {
                setError(e.response.data);
            }
        } finally {
            setLoading(false);
        }
        return response;
    }, [loginMutation, fetchSessionInfo]);


    const logout = React.useCallback(() => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_url");
        setCsrfToken("");
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
        // Add CSRF header to requests when CSRF token is updated
        if (csrfToken) {
            // Add CSRF token to each request, save the interceptor in a ref to be able to eject it on logout
            authHeaderInterceptorRef.current = axiosApi.interceptors.request.use(
                (config: AxiosRequestConfig): AxiosRequestConfig => {
                    if (config.headers) {
                        config.headers['X-CSRFToken'] = csrfToken;
                    }
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

    }, [csrfToken]);

    const memoedValue = useMemo(() => ({
            csrfToken,
            user,
            error,
            loading,
            isLoggedIn,
            login,
            logout
        }),
        [csrfToken, user, error, loading, isLoggedIn, login, logout]);

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
