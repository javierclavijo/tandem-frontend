/** @jsxImportSource @emotion/react */

import React from "react";
import "./styles/App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatList from "./features/chats/ChatList";
import Nav from "./components/Nav/Nav";
import LogOut from "./features/auth/LogOut";
import Home from "./features/home/Home";
import ChatRoom from "./features/chats/ChatRoom";
import {AuthProvider} from "./features/auth/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {jsx} from "@emotion/react";

const queryClient = new QueryClient();

export default function App() {


    return (
        <React.Fragment>
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
