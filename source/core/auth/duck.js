/**
 * Constants
 **/
export const moduleName = 'auth';
const prefix = `GLOBAL/${moduleName}`;

export const LOGIN = `${prefix}/LOGIN`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;
export const LOGIN_FAIL = `${prefix}/LOGIN_FAIL`;

export const LOGOUT = `${prefix}/LOGOUT`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAIL = `${prefix}/LOGOUT_FAIL`;

/**
 * Reducer
 **/
const ReducerState = { authenticated: false };

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOGIN_SUCCESS:
            return { ...state, authenticated: true };

        case LOGOUT_SUCCESS:
            return { ...state, authenticated: false };

        default:
            return state;
    }
}
/**
 * Selectors
 **/

/**
 * Action Creators
 **/

export const login = credentials => ({
    type:    LOGIN,
    payload: credentials,
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

export const loginFail = error => ({
    type:    LOGIN_FAIL,
    payload: error,
    error:   true,
});

export const logout = () => ({
    type: LOGOUT,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

export const logoutFail = error => ({
    type:    LOGOUT_FAIL,
    payload: error,
    error:   true,
});
