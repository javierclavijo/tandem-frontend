import React from "react";
import UserInfo from "./UserInfo";
import useAuth from "../../auth/AuthContext";

function Profile() {

    const {user} = useAuth();

    return (
        <UserInfo id={user?.url as string} url={user?.url as string}/>
    );
}

export default Profile;