import types from './types';

export const authActions = Object.freeze({
    //Login
    login: credentials => ({
        type:    types.LOGIN,
        payload: credentials,
    }),
    loginSuccess: () => ({
        type: types.LOGIN_SUCCESS,
    }),
    loginFail: error => ({
        type:    types.LOGIN_FAIL,
        payload: error,
        error:   true,
    }),
    //Logout
    logout: () => ({
        type: types.LOGOUT,
    }),
    logoutSuccess: () => ({
        type: types.LOGOUT_SUCCESS,
    }),
    logoutFail: error => ({
        type:    types.LOGOUT_FAIL,
        payload: error,
        error:   true,
    }),
});
