import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
});

// Infer the `RootState` and `AppDispatch` types from the app itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
