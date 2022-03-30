import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import {setupListeners} from "@reduxjs/toolkit/query";
import {api} from "./services/api";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the app itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
