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
import {Global, css, jsx} from "@emotion/react";
import {colors} from "./styles/variables";

const queryClient = new QueryClient();

export default function App() {

    const globalStyles = css`
      * {
        font-family: 'Rubik', 'sans-serif';
      }

      body {
        margin: 0;
        background-color: ${colors.LIGHT};
      }
    `;

    const mainCss = css`
      margin: 20px 50px;
      display:grid;
      grid-template-columns: repeat(12, 1fr);
    `;

    return (
        <React.Fragment>
            <Global styles={globalStyles}/>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <Nav/>
                    <main css={mainCss}>
                        <Routes>
                            <Route path="/chats" element={<ChatList/>}>
                                <Route path=":id" element={<ChatRoom/>}/>
                            </Route>
                            <Route path="/login" element={<LogIn/>}/>
                            <Route path="/logout" element={<LogOut/>}/>
                            <Route path="/" element={<Home/>}/>
                        </Routes>
                    </main>
                </AuthProvider>
            </QueryClientProvider>
        </React.Fragment>
    );
}
