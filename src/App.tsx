import React from 'react';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import ChatList from "./components/ChatList";

export default function App() {

    return (
        <Routes>
            <Route path="/" element={<ChatList/>}/>
        </Routes>
    );
}
