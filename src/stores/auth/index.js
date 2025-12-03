import { getUser as _getUser } from "@/utils/token";
import { createAction, createSlice } from "@reduxjs/toolkit";
import { takeLatest } from "redux-saga/effects";
import { fetchLogin, getUser, loginByCode, logout, setUser } from "./saga";

const initialState = {
  user: _getUser(),
  status: "idle",
  loginLoading: false,
};

export const {
  reducer: authReducer,
  actions: authActions,
  name,
} = createSlice({
  initialState,
  name: "auth",
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const loginAction = createAction(`${name}/login`);
export const loginByCodeAction = createAction(`${name}/loginByCode`);
export const logoutAction = createAction(`${name}/logoutAction`);
export const setUserAction = createAction(`${name}/setUserAction`);
export const getUserAction = createAction(`${name}/getUser`);
export const loginSuccessAction = createAction(`${name}/loginSuccess`);

export function* authSaga() {
  yield takeLatest(loginAction, fetchLogin);
  yield takeLatest(loginByCodeAction, loginByCode);
  yield takeLatest(logoutAction, logout);
  yield takeLatest(setUserAction, setUser);
  yield takeLatest(getUserAction, getUser);
}
