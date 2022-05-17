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

/**
 * Main axios instance used throughout the app.
 */
export const axiosApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL ?? "http://localhost:8000/api",
    withCredentials: true,
    
    // Names of the CSRF token cookie and header used by Django.
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

export function AuthProvider({children}: { children: React.ReactNode }) {
    /**
     * Authentication context provider for the app. Fetches and provides information about authentication and the user,
     * and provides functions to log in and log out.
     */

    const queryClient = useQueryClient();

    /**
     * ID of the session's user. Used in the user's query key to identify the query.
     */
    const [id, setId] = useState<string>("");

    /**
     * URL of the detail endpoint for the session's user. Used to fetch the user's data.
     */
    const [url, setUrl] = useState<string>("");

    /**
     * Holds whether the user is logged in or not.
     */
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    /**
     * Holds errors sent by the server, if any.
     */
    const [error, setError] = useState<string>("");

    /**
     * Holds whether the login request is being executed or not.
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Session's user query. Is disabled unless the user is logged in.
     */
    const {data: user} = useQuery<User>(["users", id], async () => {
        const response = await axiosApi.get(url);
        return response.data;
    }, {
        enabled: isLoggedIn && !!url && !!id,
        staleTime: 15000,
    });

    /**
     * Fetches the current session's info from the server (user ID and URL, plus CSRF token from the csrftoken cookie) 
     * and sets it in the context's state. Runs on init.
     */
    const fetchSessionInfo = React.useCallback(async () => {
        const response = await axiosApi.get('session_info/');
        if (response.data.id && response.data.url) {
            setId(response.data.id);
            setUrl(response.data.url);
            setIsLoggedIn(true);
        }
    }, [])

    /**
     * On init, fetch session info and get the CSRF cookie.
     */
    React.useEffect(()=> {fetchSessionInfo()}, [fetchSessionInfo])

    /**
     * Sends a login request.
     */
    const loginMutation = useMutation((async (data: LogInRequestData) => await axiosApi.post("login/", data)));

    /**
     * Handles user login, setting the auth context's state (error, loading, isLoggedIn) accordingly.
     */
    const login = React.useCallback(async (data: LogInRequestData) => {
        let response;
        setLoading(true);
        setError("");
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

    /**
     * Sends a logout request.
     */
    const logoutMutation = useMutation(async () => await axiosApi.post('logout/'))

    /**
     * Handles user logout, setting the auth context's state accordingly and removing the session user's query. 
     */
    const logout = React.useCallback(async () => {
        await logoutMutation.mutateAsync();
        setIsLoggedIn(false);

        // On logout, remove the logged-in user query to avoid keeping the user's data in cache
        queryClient.removeQueries(["users", id], {exact: true});
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
