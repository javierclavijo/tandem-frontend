import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Your web app's Firebase configuration

export const firebaseConfig = {
    apiKey: "AIzaSyACgcV_iXwjvv7FksKjD3uOOM5ffKGbhbw",
    authDomain: "webdev-tfg.firebaseapp.com",
    projectId: "webdev-tfg",
    storageBucket: "webdev-tfg.appspot.com",
    messagingSenderId: "283079645496",
    appId: "1:283079645496:web:f84163c1ba89c2f47b09cd"
};

export const firebaseUiConfig = {
    signInSuccessUrl: "/chats/",
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: "",
    // Privacy policy url/callback.
    privacyPolicyUrl: function () {
        // window.location.assign("<your-privacy-policy-url>");
    }
};