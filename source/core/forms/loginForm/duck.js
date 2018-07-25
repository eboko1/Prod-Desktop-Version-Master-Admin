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

const ReducerState = {
    fields: {
        login: {
            errors:     void 0,
            name:       'make',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        password: {
            errors:     void 0,
            name:       'models',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
    user: void 0,
};

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

        case LOGIN_SUCCESS:
            return {
                ...state,
                user: payload,
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

export const loginSuccess = data => ({
    type:    LOGIN_SUCCESS,
    payload: data,
});

export const onChangeLoginForm = update => ({
    type:    ON_CHANGE_LOGIN_FORM,
    payload: update,
});
