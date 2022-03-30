import {createSlice} from "@reduxjs/toolkit";
import {User} from "../entities/User";

export interface CounterState {
    token: string,
    user: User | null,
    isLoggedIn: boolean
}

const initialState: CounterState = {
    token: "",
    user: null,
    isLoggedIn: false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },
});

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
