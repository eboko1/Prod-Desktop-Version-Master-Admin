//vendor
import { PURGE } from 'redux-persist'; //REHYDRATE
/**
 * Constants
 **/
export const moduleName = 'auth';
const prefix = `GLOBAL/${moduleName}`;

export const AUTHENTICATE = `${prefix}/AUTHENTICATE`;
export const AUTHENTICATE_SUCCESS = `${prefix}/AUTHENTICATE_SUCCESS`;
export const AUTHENTICATE_FAIL = `${prefix}/AUTHENTICATE_FAIL`;

export const UPDATE_USER = `${prefix}/UPDATE_USER`;
export const UPDATE_USER_SUCCESS = `${prefix}/UPDATE_USER_SUCCESS`;

export const LOGOUT = `${prefix}/LOGOUT`;
export const LOGOUT_SUCCESS = `${prefix}/LOGOUT_SUCCESS`;
export const LOGOUT_FAIL = `${prefix}/LOGOUT_FAIL`;

/**
 * Reducer
 **/
const ReducerState = {
    avatar:     null,
    businessId: null,
    email:      null,
    id:         null,
    isAdmin:    null,
    language:   null,
    name:       '',
    phone:      null,
    roleIds:    [],
    scope:      [],
    surname:    '',
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case AUTHENTICATE:
            return { ...state, ...payload };

        case UPDATE_USER_SUCCESS:
            return { ...state, ...payload };

        case LOGOUT_SUCCESS:
            return ReducerState;

        // case REHYDRATE: // This added just to show that this action type also exists, can be omitted.
        //     return state;

        case PURGE:
            return state; // Return the initial state of this reducer to 'reset' the app

        default:
            return state;
    }
}
/**
 * Selectors
 **/

export const selectToken = state => state.auth.token;
export const selectAdmin = state => state.auth.scope.indexOf('ADMIN') > -1;

/**
 * Action Creators
 **/

export const authenticate = user => ({
    type:    AUTHENTICATE,
    payload: user,
});

export const authenticateSuccess = () => ({
    type: AUTHENTICATE_SUCCESS,
});

export const updateUser = user => ({
    type:    UPDATE_USER,
    payload: user,
});

export const updateUserSuccess = user => ({
    type:    UPDATE_USER_SUCCESS,
    payload: user,
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

export const purge = ReducerState => ({
    type:    PURGE,
    payload: ReducerState,
});
