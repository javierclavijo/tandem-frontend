import React, {useEffect, useState} from "react";
import "./App.css";
import {Route, Routes, useLocation} from "react-router-dom";
import LogIn from "./components/LogIn";
import ChatList from "./components/ChatList";
import Nav from "./components/Nav";
import LogOut from "./components/LogOut";
import Home from "./components/Home";

export default function App() {
    const [token, setToken] = useState<string>("");
    const location = useLocation();

    const fetchToken = () => {
        const token = localStorage.getItem("auth-token");
        if (token) {
            setToken(token);
        }
    };
    useEffect(fetchToken, [location]);

    return (
        <React.Fragment>
            <Nav token={token}/>
            <Routes>
                <Route path="/chats" element={<ChatList token={token}/>}/> :
                <Route path="/login" element={<LogIn setToken={setToken}/>}/>
                <Route path="/logout" element={<LogOut setToken={setToken}/>}/>
                <Route path="/" element={<Home token={token}/>}/>
            </Routes>
        </React.Fragment>
    );
}
