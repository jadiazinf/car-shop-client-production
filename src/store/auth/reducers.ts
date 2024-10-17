import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthStatus } from '../../auth/types';
import { AuthReducer } from './types';

const initialState: AuthReducer = {
  status: AuthStatus.NOT_AUTHENTICATED,
  token: null,
  sessionType: null
}

const authSlice = createSlice({
  name: 'auth-slice',
  initialState,
  reducers: {
    SetAuthentication: (state: AuthReducer, action: PayloadAction<AuthReducer>) => {
      state.status = action.payload.status;
      state.token = action.payload.token;
      state.sessionType = action.payload.sessionType;
    },
    Deauthenticate: (state: AuthReducer) => {
      state.status = initialState.status;
      state.token = initialState.token;
      state.sessionType = initialState.sessionType
    }
  }
});

export default authSlice;

export const { SetAuthentication, Deauthenticate } = authSlice.actions;
