/** @jsxImportSource @emotion/react */

import React from "react";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./components/LogIn";
import ChatList from "./components/ChatList";
import Nav from "./components/Nav";
import LogOut from "./components/LogOut";
import Home from "./components/Home";
import ChatRoom from "./components/ChatRoom";
import {AuthProvider} from "./app/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {Global, jsx, css} from "@emotion/react";

const queryClient = new QueryClient();

export default function App() {

    const globalStyles = css`
    `;

    return (
        <React.Fragment>
            <Global styles={globalStyles}/>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Nav/>
                    <Routes>
                        <Route path="/chats" element={<ChatList/>}>
                            <Route path=":id" element={<ChatRoom/>}/>
                        </Route>
                        <Route path="/login" element={<LogIn/>}/>
                        <Route path="/logout" element={<LogOut/>}/>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                </AuthProvider>
            </QueryClientProvider>
        </React.Fragment>
    );
}
