/**
 * Constants
 * */
export const moduleName = 'addOrderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ADD_ORDER_FORM = `${prefix}/FETCH_ADD_ORDER_FORM`;
export const FETCH_ADD_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ADD_ORDER_FORM_SUCCESS`;

export const ON_CHANGE_ADD_ORDER_FORM = `${prefix}/ON_CHANGE_ADD_ORDER_FORM`;

export const SUBMIT_ADD_ORDER_FORM = `${prefix}/SUBMIT_ADD_ORDER_FORM`;
export const SUBMIT_ADD_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ADD_ORDER_FORM_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        status: {
            errors:     void 0,
            name:       'status',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        date: {
            errors:     void 0,
            name:       'date',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        post: {
            errors:     void 0,
            name:       'post',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        client: {
            errors:     void 0,
            name:       'client',
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
        paymentMethod: {
            errors:     void 0,
            name:       'paymentMethod',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        service: {
            errors:     void 0,
            name:       'service',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
    allServices: [],
    clients:     [],
    managers:    [],
    employees:   [],
    vehicles:    [],
    stations:    [],
    allDetails:  {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ADD_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_ADD_ORDER_FORM:
            // console.group('→ REDUX');
            // console.log('@@payload', payload);
            // console.log('@@ meta field', meta.field);
            // console.log('@@ return', {
            //     ...state,
            //     fields: {
            //         [ meta.field ]: { ...payload[ meta.field ] },
            //     },
            // });
            // console.groupEnd();

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [ meta.field ]: { ...payload[ meta.field ] },
                },
            };

        case SUBMIT_ADD_ORDER_FORM:
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

export const fetchAddOrderForm = () => ({
    type: FETCH_ADD_ORDER_FORM,
});

export function fetchAddOrderFormSuccess(data) {
    return {
        type:    FETCH_ADD_ORDER_FORM_SUCCESS,
        payload: data,
    };
}

export const onChangeAddOrderForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_ADD_ORDER_FORM,
    payload: fields,
    meta:    { form, field },
});

export const submitAddOrderForm = addOrderForm => ({
    type:    SUBMIT_ADD_ORDER_FORM,
    payload: addOrderForm,
});

export const submitAddOrderFormSuccess = () => ({
    type: SUBMIT_ADD_ORDER_FORM_SUCCESS,
});

// // Core
// // import { handleActions } from 'redux-actions';
// import { fromJS } from 'immutable';
// import { createSelector } from 'reselect';
//
// // Actions
// // import antdReduxFormActions as actions from './actions';
// import types from './types';
//
// const initialState = {
//     addOrder: {
//         status: {
//             errors:     void 0,
//             name:       'status',
//             touched:    true,
//             validating: false,
//             value:      '',
//             dirty:      false,
//         },
//     },
// };
//
// export default (state = initialState, action) => {
//     switch (action.type) {
//         // case types.CHANGE:
//         //     return {
//         //         ...state,
//         //         // state[action.meta.form],
//         //     };
//         case types.CHANGE: {
//             const newState = {
//                 ...state,
//             };
//             _.set(newState, `${action.meta.form}.${action.meta.field}`, {
//                 ...action.payload[ action.meta.field ],
//             });
//
//             console.log('→ newState', newState);
//
//             return newState;
//         }
//
//         //     { meta: { form, field } },
//         //     state.update(form, form =>
//         //         /**
//         //          * Сперва обновляет определенное поле определенной формы
//         //          * Затем − удаляет ошибки со всех полей формы
//         //          */
//         //         form.merge(fromJS(field)).map(field => {
//         //             return field.delete('errors');
//         //         })),
//         // );
//
//         case types.SET_ERRORS: {
//             const formState = {
//                 ...state,
//             };
//             _.set(formState, `${action.meta.form}.${action.meta.field}`, {
//                 errors: action.payload,
//             });
//
//             console.log('→ formState', formState);
//
//             // const formState = {
//             //     [ action.meta.form ]: {
//             //         // ← здесь форма
//             //         ...state[ action.meta.field ], // ← здесь имя филда
//             //         errors: action.payload, // ← здесь error
//             //     },
//             // };
//
//             return formState;
//         }
//
//         case types.RESET:
//             return {
//                 [ action.payload ]: initialState,
//             };
//
//         default:
//             return state;
//     }
// };
//
// // export default handleActions(
// //     {
// //         [ actions.change ]: (state, { payload: field, meta: form }) =>
// //             state.update(form, form =>
// //                 /**
// //                  * Сперва обновляет определенное поле определенной формы
// //                  * Затем − удаляет ошибки со всех полей формы
// //                  */
// //                 form.merge(fromJS(field)).map(field => {
// //                     return field.delete('errors');
// //                 })),
// //         [ actions.setErrors ]: (
// //             state,
// //             { payload: errors, meta: { form, field } },
// //         ) =>
// //             state.updateIn([ form, field ], field => field.merge(fromJS(errors))),
// //         [ actions.reset ]: (state, { meta: form }) =>
// //             state.set(form, initialState.get(form)),
// //     },
// //     initialState,
// // );
//
// // Core
// // export const selectLoginForm = createSelector(
// //     state => state.forms.login,
// //     login => login,
// // );
