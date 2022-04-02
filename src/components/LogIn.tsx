import React from "react";
import {StyledFirebaseAuth} from "react-firebaseui";
import {firebaseConfig, firebaseUiConfig} from "../app/services/firebaseApp";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";


firebase.initializeApp(firebaseConfig);

function LogIn() {

    return (
        <div>
            <h2>Log In</h2>
            <StyledFirebaseAuth uiConfig={firebaseUiConfig} firebaseAuth={firebase.auth()}/>
        </div>
    );
}

export default LogIn;
