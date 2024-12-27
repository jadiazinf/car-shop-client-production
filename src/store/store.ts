import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/lib/persistStore";
import persistReducer from "redux-persist/lib/persistReducer";
import authSlice from "./auth/reducers";
import langSlice from "./lang/reducers";
import { AuthReducer } from "./auth/types";
import { LangReducer } from "./lang/types";
import EnvironmentVariables from "../helpers/environment/variables";
import { useSelector } from "react-redux";
import { PersistedStore } from "./types";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer", "langReducer"],
  transforms: [
    encryptTransform({
      secretKey: EnvironmentVariables.REDUX_PERSIST_KEY || "ThereIsNoKeyF",
      onError: () => {
        console.log("Error on persist config");
      },
    }),
  ],
};

const rootReducer = combineReducers({
  authReducer: authSlice.reducer as Partial<AuthReducer>,
  langReducer: langSlice.reducer as Partial<LangReducer>,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    persistedReducer,
  },
});

export const persistorStore = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const usePersistedStore = () =>
  useSelector((state: RootState): PersistedStore => state.persistedReducer);
