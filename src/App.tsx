/** @jsxImportSource @emotion/react */

import React from "react";
import "./styles/App.css";
import {Route, Routes} from "react-router-dom";
import LogIn from "./features/auth/LogIn";
import ChatList from "./features/chats/list/ChatList";
import Nav from "./components/Nav/Nav";
import LogOut from "./features/auth/LogOut";
import HomeView from "./features/home/HomeView";
import ChatRoom from "./features/chats/room/ChatRoom";
import {AuthProvider} from "./features/auth/AuthContext";
import {QueryClient, QueryClientProvider} from "react-query";
import {Global, css} from "@emotion/react";
import {colors} from "./styles/variables";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import Tabs from "./components/Nav/Tabs";

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
        height: 100vh;
        display: grid;
        grid-template-rows: 5rem 1fr 3rem;
        grid-template-columns: 1fr;
        grid-template-areas: "header"
          "main"
          "tabs";

        @media (min-width: 1025px) {
          grid-template-rows: 5rem 1fr 0;
        }
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
                        <Route path="/" element={<HomeView/>}/>
                    </Routes>
                    <Tabs/>
                </AuthProvider>
            </QueryClientProvider>
        </React.Fragment>
    );
}
