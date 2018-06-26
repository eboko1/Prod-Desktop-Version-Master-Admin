import _ from 'lodash';

/**
 * Constants
 * */
export const moduleName = 'universalFiltersForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_PROFILE_FORM = `${prefix}/FETCH_PROFILE_FORM`;
export const FETCH_PROFILE_FORM_SUCCESS = `${prefix}/FETCH_PROFILE_FORM_SUCCESS`;

export const ON_CHANGE_PROFILE_FORM = `${prefix}/ON_CHANGE_PROFILE_FORM`;

/**
 * Reducer
 * */
//
// const ReducerState = {
//     orderComments:    [],
//     services:         [],
//     managers:         [],
//     employees:        [],
//     vehicleModels:    [],
//     vehicleMakes:     [],
//     creationsReasons: [],
// };

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
    },
    orderComments:    [],
    services:         [],
    managers:         [],
    employees:        [],
    vehicleModels:    [],
    vehicleMakes:     [],
    creationsReasons: [],
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

            // console.log('→ newState', newState);

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
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export const fetchProfileForm = () => ({
    type: FETCH_PROFILE_FORM,
});

export function fetchProfileFormSuccess(filters) {
    return {
        type:    FETCH_PROFILE_FORM_SUCCESS,
        payload: filters,
    };
}

export const onChangeProfileForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_PROFILE_FORM,
    payload: fields,
    meta:    { form, field },
});
