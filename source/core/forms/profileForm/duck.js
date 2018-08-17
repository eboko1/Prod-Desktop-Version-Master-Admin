import _ from 'lodash';

/**
 * Constants
 * */
export const moduleName = 'profileForm';
const prefix = `cpb/${moduleName}`;

// export const FETCH_PROFILE_FORM = `${prefix}/FETCH_PROFILE_FORM`;
// export const FETCH_PROFILE_FORM_SUCCESS = `${prefix}/FETCH_PROFILE_FORM_SUCCESS`;

export const ON_CHANGE_PROFILE_FORM = `${prefix}/ON_CHANGE_PROFILE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        email: {
            errors:     void 0,
            name:       'email',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        phone: {
            errors:     void 0,
            name:       'phone',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        locale: {
            name: 'locale',
        },
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_PROFILE_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_PROFILE_FORM: {
            const newState = {
                ...state,
            };
            _.set(newState, `${action.meta.form}.${action.meta.field}`, {
                ...action.payload[ action.meta.field ],
            });

            return newState;
        }

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

// export const fetchProfileForm = () => ({
//     type: FETCH_PROFILE_FORM,
// });
//
// export function fetchProfileFormSuccess(filters) {
//     return {
//         type:    FETCH_PROFILE_FORM_SUCCESS,
//         payload: filters,
//     };
// }

export const onChangeProfileForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_PROFILE_FORM,
    payload: fields,
    meta:    { form, field },
});
