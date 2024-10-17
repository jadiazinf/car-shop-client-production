import { AuthReducer } from "./auth/types";
import { LangReducer } from "./lang/types";

export type PersistedStore = {
  authReducer: AuthReducer;
  langReducer: LangReducer;
}
