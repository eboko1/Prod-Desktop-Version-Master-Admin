import { Record, List } from 'immutable';
import { createSelector } from 'reselect';

/**
 * Constants
 * */
export const moduleName = 'form';
const prefix = `app/${moduleName}/`;
// export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`;
// export const ADD_PERSON = `${prefix}/ADD_PERSON`;

export const types = Object.freeze({
    SET_FIRST_NAME: `${prefix}SET_FIRST_NAME`,
    SET_LAST_NAME:  `${prefix}SET_LAST_NAME`,
    SET_EMAIL:      `${prefix}SET_EMAIL`,
    SET_PASSWORD:   `${prefix}SET_PASSWORD`,
    SET_PHONE:      `${prefix}SET_PHONE`,
    SET_AVATAR:     `${prefix}SET_AVATAR`,
    SET_LANG:       `${prefix}SET_LANG`,
});

/**
 * Reducer
 * */
const initialState = {
    user: {
        firstName: '',
        lastName:  '',
        phone:     '',
        email:     '',
        password:  '',
        avatar:    '',
        lang:      '',
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_FIRST_NAME:
            return {
                firstName: action.payload.firstName,
            };
        case types.SET_LAST_NAME:
            return {
                lastName: action.payload.lastName,
            };
        case types.SET_EMAIL:
            return {
                email: action.payload.email,
            };
        case types.SET_PASSWORD:
            return {
                password: action.payload.password,
            };
        case types.SET_PHONE:
            return {
                phone: action.payload.phone,
            };
        case types.SET_AVATAR:
            return {
                avatar: action.payload.avatar,
            };
        case types.SET_LANG:
            return {
                lang: action.payload.lang,
            };
        default:
            return state;
    }
};

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const profileSelector = createSelector(stateSelector, state =>
    stateSelector,
    (state) => state.forms.formikForm.user

/**
 * Action Creators
 * */

export const formsActions = Object.freeze({
    setFirstName: firstName => ({
        type:    types.SET_FIRST_NAME,
        payload: firstName,
    }),

    setLastName: lastName => ({
        type:    types.SET_LAST_NAME,
        payload: lastName,
    }),

    setEmail: email => ({
        type:    types.SET_EMAIL,
        payload: email,
    }),

    setPassword: password => ({
        type:    types.SET_PASSWORD,
        payload: password,
    }),

    setPhone: phone => ({
        type:    types.SET_PHONE,
        payload: phone,
    }),

    setAvatar: avatar => ({
        type:    types.SET_AVATAR,
        payload: avatar,
    }),

    setLang: lang => ({
        type:    types.SET_LANG,
        payload: lang,
    }),
});
