import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../app/hooks";
import {selectToken} from "../app/authSlice";

function Home() {
    const token = useAppSelector(selectToken);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/chats");
        } else {
            navigate("/login");
        }
    }, [token]);

    return (
        <React.Fragment/>
    );
}

export default Home;
