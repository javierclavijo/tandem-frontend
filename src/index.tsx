import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import '@csstools/normalize.css';

const browserRouter = (
    <React.StrictMode>
        <BrowserRouter>
            <App/>
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
