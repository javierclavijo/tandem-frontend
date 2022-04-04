import React from "react";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./components/LogIn";
import ChatList from "./components/ChatList";
import Nav from "./components/Nav";
import LogOut from "./components/LogOut";
import Home from "./components/Home";
import ChatMain from "./components/ChatMain";
import {AuthProvider} from "./app/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient();

export default function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Nav/>
                <Routes>
                    <Route path="/chats" element={<ChatList/>}>
                        <Route path=":id" element={<ChatMain/>}/>
                    </Route>
                    <Route path="/login" element={<LogIn/>}/>
                    <Route path="/logout" element={<LogOut/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </AuthProvider>
        </QueryClientProvider>
    );
}
