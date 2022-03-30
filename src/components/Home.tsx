import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Home({token}: { token: string }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate("/chats");
        } else {
            navigate("/login");
        }
    });

    return (
        <React.Fragment/>
    );
}

export default Home;
