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
import useAuth from "./features/auth/AuthContext";
import {css, Global} from "@emotion/react";
import {colors} from "./styles/variables";
import EmptyChatRoom from "./features/chats/room/EmptyChatRoom";
import {useMediaQuery} from "react-responsive";
import Tabs from "./components/Nav/Tabs";
import ChatInfo from "./features/info/ChatInfo";


export default function App() {

    const isDesktop = useMediaQuery({query: "(min-width: 1024px)"});
    const {isLoggedIn} = useAuth();

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
        grid-template-columns: 1fr;
        grid-template-areas:  "header"
                              "main"
                              "tabs";
        grid-template-rows: 5rem 1fr 3rem;

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
            <Nav/>
            <Routes>
                <Route path="/chats" element={<ChatList/>}>
                    <Route path=":id/info" element={<ChatInfo/>}/>
                    <Route path=":id" element={<ChatRoom/>}/>
                    <Route index element={<EmptyChatRoom/>}/>
                </Route>
                <Route path="/login" element={<LogIn/>}/>
                <Route path="/logout" element={<LogOut/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
            {!isDesktop && isLoggedIn ?
                <Tabs/> :
                null
            }
        </React.Fragment>
    );
}
