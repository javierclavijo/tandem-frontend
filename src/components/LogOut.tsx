import React, {Fragment, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "../app/AuthContext";

function LogOut() {
    const navigate = useNavigate();
    const {logout} = useAuth();

    useEffect(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);

    return (
        <Fragment/>
    );
}

export default LogOut;
