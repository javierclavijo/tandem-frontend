import React, {useContext, useMemo, useState} from "react";
import axios from "axios";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {User} from "../../entities/User";


interface AuthContextType {
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

export const axiosApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:8000/api",
    withCredentials: true,
    xsrfCookieName: 'csrftoken', // default
    xsrfHeaderName: 'X-CSRFToken', // default
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    /**
     * Authentication context for the app. Fetches and provides information about authentication and the user, and provides functions to log in and log out.
     */

    const queryClient = useQueryClient();

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

    /**
     * Fetches the current session's info from the server (user ID and URL, plus CSRF token from the csrftoken cookie) and sets it in the context's state. Runs on init.
     */
    const fetchSessionInfo = React.useCallback(async () => {
        const response = await axiosApi.get('session_info/')
        if (response.data.id && response.data.url) {
            setId(response.data.id)
            setUrl(response.data.url)
            setIsLoggedIn(true)
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

    const logoutMutation = useMutation(async ()=> await axiosApi.post('logout/'))

    const logout = React.useCallback(async () => {
        await logoutMutation.mutateAsync()
        
        setIsLoggedIn(false);

        // On logout, remove the logged-in user query to avoid keeping the user's data in cache
        queryClient.removeQueries(["users", id], {exact: true});

        // Also, eject the Axios interceptor which appends the Authorization header
        const interceptor = authHeaderInterceptorRef.current;
        if (interceptor !== null) {
            axiosApi.interceptors.request.eject(interceptor);
        }
    }, [id, queryClient, logoutMutation]);

    const memoedValue = useMemo(() => ({
            user,
            error,
            loading,
            isLoggedIn,
            login,
            logout
        }),
        [ user, error, loading, isLoggedIn, login, logout]);

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
