import { authService } from "@/services/auth";
import { userService } from "@/services/user";
import {
  setUser as _setUser,
  clearToken,
  clearUser,
  setToken,
} from "@/utils/token";
import { createAction } from "@reduxjs/toolkit";
import { call, put } from "redux-saga/effects";
import { authActions } from ".";

export const loginAction = createAction("auth/login");
export const loginByCodeAction = createAction("auth/loginByCode");
export const logoutAction = createAction("auth/logoutAction");
export const setUserAction = createAction("auth/setUserAction");
export const getUserAction = createAction("auth/getUser");
export const loginSuccessAction = createAction("auth/loginSuccess");

export function* fetchLogin(action) {
  try {
    const res = yield call(authService.login, action.payload);
    setToken(res.data);
    const user = yield call(userService.getUser);
    yield put(authActions.setUser(user.data));
    yield put(loginSuccessAction());
    setUser(user.data);
    return user.data;
  } catch (error) {
    throw error.response.data;
  }
}
export function* loginByCode(action) {
  try {
    const res = yield call(authService.loginByCode, { code: action.payload });
    setToken(res.data);
    const user = yield call(userService.getUser);
    setUser(user.data);
    return user.data;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
}
export function* logout() {
  yield put(authActions.logout());
  clearToken();
  clearUser();
}
export function* setUser(action) {
  _setUser(action.payload);
  yield put(authActions.setUser(action.payload));
}
export function* getUser() {
  try {
    const user = yield call(userService.getUser);
    setUser(user.data);
    yield put(authActions.setUser(user.data));
  } catch (error) {}
}
