/** @jsxImportSource @emotion/react */

import React from "react";
import "./styles/App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatList from "./features/chats/list/ChatList";
import Nav from "./components/Nav/Nav";
import LogOut from "./features/auth/LogOut";
import Home from "./features/home/Home";
import ChatRoom from "./features/chats/room/ChatRoom";
import {AuthProvider} from "./features/auth/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {Global, css} from "@emotion/react";
import {colors} from "./styles/variables";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";

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

      // Main page layout
      #root {
        width: 100vw;
        min-height: 100vh;
        display: grid;
        grid-template-rows: 5rem 1fr;
        grid-template-columns: 3.125rem 1fr 3.125rem;
        grid-template-areas: "header header header"
        ". main .";
      }
      
      
      // Scrollbar styles
      ::-webkit-scrollbar {
        width: 0.5rem;
      }

      ::-webkit-scrollbar-track {
        margin-block: 0.25rem;
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${colors.SECONDARY};
        border-radius: 100vw;
      }

      // Firefox-specific scrollbar styles
      @supports (scrollbar-width: thin) {
        * {
          scrollbar-width: thin;
          scrollbar-color: ${colors.SECONDARY} ${colors.WHITE};
        }
      }
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
                            <Route index element={<EmptyChatRoom/>}/>
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
