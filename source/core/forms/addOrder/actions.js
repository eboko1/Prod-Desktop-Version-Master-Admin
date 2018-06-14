// Types
import types from './types';

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
