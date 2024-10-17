import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LanguagesOptions } from "../../locales/types";
import { LangReducer } from "./types";

const initialState: LangReducer = {
  lang: LanguagesOptions.ES,
};

const langSlice = createSlice({
  name: 'lang-slice',
  initialState,
  reducers: {
    SetLang: (state, action: PayloadAction<LanguagesOptions>) => {
      state.lang = action.payload;
    }
  }
});

export default langSlice;

export const { SetLang } = langSlice.actions;
