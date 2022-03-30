import React, {Fragment, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../app/hooks";
import {removeCredentials} from "../app/authSlice";

function LogOut() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(removeCredentials())
        navigate("/");
    };

    useEffect(handleLogout, []);

    return (
        <Fragment/>
    );
}

export default LogOut;
