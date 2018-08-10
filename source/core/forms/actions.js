// Core
import { createActions } from 'redux-actions';

// Types
import * as types from './types';

export const { forms: { change, reset, setErrors } } = createActions({
    [ types.DOMAIN ]: {
        [ types.CHANGE ]:     [ (_, field) => field, form => form ],
        [ types.SET_ERRORS ]: [
            (_, __, errors) => errors,
            (form, field) => ({
                form,
                field,
            }),
        ],
        [ types.RESET ]: [ void 0, form => form ],
    },
});
