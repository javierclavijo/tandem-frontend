import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {AuthProvider} from "./app/AuthContext";

const browserRouter = (
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);

ReactDOM.render(
    browserRouter,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
