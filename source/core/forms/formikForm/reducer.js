import types from './types';
import { Record } from 'immutable';
import { createSelector } from 'reselect';

// const initialState = {
//     firstName: 'Obivan Obivanovych',
//     lastName:  '',
//     phone:     '',
//     email:     '',
//     password:  '',
//     avatar:    '',
//     lang:      '',
// };
const initialState = Record({
    firstName: 'Obivan Obivanovych',
    lastName:  '',
    phone:     '',
    email:     '',
    password:  '',
    avatar:    '',
    lang:      '',
});

export default (state = initialState(), action) => {
    const { type, payload } = action;

    switch (type) {
        case types.SET_FIRST_NAME:
            return state.set('firstName', payload);
        // {
        //     firstName: action.payload,
        // };
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

export const stateSelector = state => state.forms;
export const profileSelector = createSelector(
    stateSelector,
    state => state.formikForm,
    // state => state.formikForm.user,
);
