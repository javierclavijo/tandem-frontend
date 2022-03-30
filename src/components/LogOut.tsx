import React, {Fragment, useEffect} from "react";
import {useNavigate} from "react-router-dom";

function LogOut({setToken}: { setToken: Function }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("auth-token");
        setToken("");
        navigate("/");
    };
    useEffect(handleLogout);

    return (
        <Fragment/>
    );
}

export default LogOut;
