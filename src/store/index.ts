import { Action, configureStore, createReducer, ThunkAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { rolesReducer } from "../features/Roles/roles-slice";

export const store = configureStore({
    reducer: {
        creator: createReducer,
        roles: rolesReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
