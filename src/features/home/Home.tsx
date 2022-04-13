import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "../auth/AuthContext";

function Home() {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/chats");
        } else {
            navigate("/login");
        }
    }, [isLoggedIn]);

    return (
        <React.Fragment/>
    );
}

export default Home;
