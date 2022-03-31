import React from "react";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./components/LogIn";
import ChatList from "./components/ChatList";
import Nav from "./components/Nav";
import LogOut from "./components/LogOut";
import Home from "./components/Home";
import Chat from "./components/Chat";

export default function App() {
    return (
        <React.Fragment>
            <Nav/>
            <Routes>
                <Route path="/chats" element={<ChatList/>}>
                    <Route path=":id" element={<Chat/>}/>
                </Route> :
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/logout" element={<LogOut/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </React.Fragment>
    );
}
