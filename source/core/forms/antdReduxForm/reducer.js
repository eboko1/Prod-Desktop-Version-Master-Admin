// Core
// import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { createSelector } from 'reselect';

// Actions
// import antdReduxFormActions as actions from './actions';
import types from './types';

const initialState = {
    login: {
        email: {
            errors:     void 0,
            name:       'email',
            touched:    true,
            validating: false,
            value:      '',
            dirty:      false,
        },
        password: {
            errors:     void 0,
            name:       'password',
            touched:    true,
            validating: false,
            value:      '',
            dirty:      false,
        },
    },
};

export default (state = initialState, action) => {
    switch (action.type) {
        // case types.CHANGE:
        //     return {
        //         ...state,
        //         // state[action.meta.form],
        //     };
        case types.CHANGE: {
            const newState = {
                ...state,
            };
            _.set(newState, `${action.meta.form}.${action.meta.field}`, {
                ...action.payload[ action.meta.field ],
            });

            console.log('→ newState', newState);

            return newState;
        }

        //     { meta: { form, field } },
        //     state.update(form, form =>
        //         /**
        //          * Сперва обновляет определенное поле определенной формы
        //          * Затем − удаляет ошибки со всех полей формы
        //          */
        //         form.merge(fromJS(field)).map(field => {
        //             return field.delete('errors');
        //         })),
        // );

        case types.SET_ERRORS: {
            const formState = {
                ...state,
            };
            _.set(formState, `${action.meta.form}.${action.meta.field}`, {
                errors: action.payload,
            });

            console.log('→ formState', formState);

            // const formState = {
            //     [ action.meta.form ]: {
            //         // ← здесь форма
            //         ...state[ action.meta.field ], // ← здесь имя филда
            //         errors: action.payload, // ← здесь error
            //     },
            // };

            return formState;
        }

        case types.RESET:
            return {
                [ action.payload ]: initialState,
            };

        default:
            return state;
    }
};

// export default handleActions(
//     {
//         [ actions.change ]: (state, { payload: field, meta: form }) =>
//             state.update(form, form =>
//                 /**
//                  * Сперва обновляет определенное поле определенной формы
//                  * Затем − удаляет ошибки со всех полей формы
//                  */
//                 form.merge(fromJS(field)).map(field => {
//                     return field.delete('errors');
//                 })),
//         [ actions.setErrors ]: (
//             state,
//             { payload: errors, meta: { form, field } },
//         ) =>
//             state.updateIn([ form, field ], field => field.merge(fromJS(errors))),
//         [ actions.reset ]: (state, { meta: form }) =>
//             state.set(form, initialState.get(form)),
//     },
//     initialState,
// );

// Core
// export const selectLoginForm = createSelector(
//     state => state.forms.login,
//     login => login,
// );
