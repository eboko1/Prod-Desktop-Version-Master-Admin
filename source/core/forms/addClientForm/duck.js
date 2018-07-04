/**
 * Constants
 * */
export const moduleName = 'addClientForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ADD_CLIENT_FORM = `${prefix}/FETCH_ADD_CLIENT_FORM`;
export const FETCH_ADD_CLIENT_FORM_SUCCESS = `${prefix}/FETCH_ADD_CLIENT_FORM_SUCCESS`;

export const ON_CHANGE_ADD_CLIENT_FORM = `${prefix}/ON_CHANGE_ADD_CLIENT_FORM`;

export const SUBMIT_ADD_CLIENT_FORM = `${prefix}/SUBMIT_ADD_CLIENT_FORM`;
export const SUBMIT_ADD_CLIENT_FORM_SUCCESS = `${prefix}/SUBMIT_ADD_CLIENT_FORM_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        name: {
            errors:     void 0,
            name:       'name',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        surname: {
            errors:     void 0,
            name:       'surname',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        patronymic: {
            errors:     void 0,
            name:       'patronymic',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        gender: {
            errors:     void 0,
            name:       'gender',
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
        email: {
            errors:     void 0,
            name:       'email',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case ON_CHANGE_ADD_CLIENT_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    [ meta.field ]: { ...payload[ meta.field ] },
                },
            };

        case SUBMIT_ADD_CLIENT_FORM:
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
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export const fetchAddClientForm = () => ({
    type: FETCH_ADD_CLIENT_FORM,
});

export function fetchAddClientFormSuccess(data) {
    return {
        type:    FETCH_ADD_CLIENT_FORM_SUCCESS,
        payload: data,
    };
}

export const onChangeAddClientForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_ADD_CLIENT_FORM,
    payload: fields,
    meta:    { form, field },
});

export const submitAddClientForm = addClientForm => ({
    type:    SUBMIT_ADD_CLIENT_FORM,
    payload: addClientForm,
});

export const submitAddClientFormSuccess = () => ({
    type: SUBMIT_ADD_CLIENT_FORM_SUCCESS,
});
