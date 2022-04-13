import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "../auth/AuthContext";

function HomeView() {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/chats");
        } else {
            navigate("/login");
        }
    }, [navigate, isLoggedIn]);

    return (
        <React.Fragment/>
    );
}

export default HomeView;
