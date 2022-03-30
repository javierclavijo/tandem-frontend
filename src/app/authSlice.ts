import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

type AuthState = {
    token: string | null
}

const slice = createSlice({
    name: "auth",
    initialState: {token: null} as AuthState,
    reducers: {
        setCredentials: (
            state,
            {payload: {token}}: PayloadAction<{ token: string }>
        ) => {
            state.token = token;
        },
        removeCredentials: (state) => {
            state.token = null;
        }
    },
});

export const {setCredentials, removeCredentials} = slice.actions;

export default slice.reducer;

export const selectToken = (state: RootState) => state.auth.token;

// Initial code source: https://codesandbox.io/s/github/reduxjs/redux-toolkit/tree/master/examples/query/react/authentication?from-embed
