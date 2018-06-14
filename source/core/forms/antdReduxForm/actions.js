// Core
// import { createActions } from 'redux-actions';

// Types
import types from './types';

// export const {
//     forms: { change, reset, setErrors },
// } = createActions({
//     [ types.DOMAIN ]: {
//         [ types.CHANGE ]:     [ (_, field) => field, form => form ],
//         [ types.SET_ERRORS ]: [
//             (_, __, errors) => errors,
//             (form, field) => ({
//                 form,
//                 field,
//             }),
//         ],
//         [ types.RESET ]: [ void 0, form => form ],
//     },
// });

export const antdReduxFormActions = Object.freeze({
    change: (fields, { form, field }) => ({
        type:    types.CHANGE,
        payload: fields,
        meta:    { form, field },
    }),

    setErrors: (errors, { form, field }) => ({
        type:    types.SET_ERRORS,
        payload: errors,
        error:   true,
        meta:    { form, field },
    }),

    reset: form => ({
        type:    types.RESET,
        payload: void 0,
        meta:    form,
    }),
});
