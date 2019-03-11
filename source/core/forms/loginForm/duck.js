/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'loginForm';
const prefix = `cpb/${moduleName}`;

export const LOGIN = `${prefix}/LOGIN`;
export const LOGIN_SUCCESS = `${prefix}/LOGIN_SUCCESS`;

export const ON_CHANGE_LOGIN_FORM = `${prefix}/ON_CHANGE_LOGIN_FORM`;

/**
 * Reducer
 * */
//

const ReducerState = {};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_LOGIN_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const login = credentials => ({
    type:    LOGIN,
    payload: credentials,
});

export const loginSuccess = () => ({
    type: LOGIN_SUCCESS,
});

export const onChangeLoginForm = update => ({
    type:    ON_CHANGE_LOGIN_FORM,
    payload: update,
});
