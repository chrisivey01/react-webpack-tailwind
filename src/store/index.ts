import { groupsReducer } from './../features/Groups/groups-slice';
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { creatorReducer } from "../features/Create/creator-slice";
import { rolesReducer } from "../features/Roles/roles-slice";

export const store = configureStore({
    reducer: {
        creator: creatorReducer,
        roles: rolesReducer,
        groups: groupsReducer
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
