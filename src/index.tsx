import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import "./styles/index.css";
import "@csstools/normalize.css";
import {QueryClient, QueryClientProvider} from "react-query";
import {AuthProvider} from "./features/auth/AuthContext";

const queryClient = new QueryClient();

const browserRouter = (
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </QueryClientProvider>
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
