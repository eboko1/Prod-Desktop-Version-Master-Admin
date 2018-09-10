/**
 * Constants
 * */
export const moduleName = 'editClientForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_CLIENT_FORM = `${prefix}/ON_CHANGE_CLIENT_FORM`;

export const UPDATE_CLIENT = `${prefix}/UPDATE_CLIENT`;
export const UPDATE_CLIENT_SUCCESS = `${prefix}/UPDATE_CLIENT_SUCCESS`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */
let errorId = 1;

const ReducerState = {
    errors:       [],
    fields:       {},
    editableItem: null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_ERROR:
            return {
                ...state,
                errors: [ ...state.errors, { id: errorId++, ...payload }],
            };

        case HANDLE_ERROR:
            return {
                ...state,
                errors: state.errors.filter(({ id }) => id !== payload),
            };

        case ON_CHANGE_CLIENT_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case UPDATE_CLIENT_SUCCESS:
            return {
                ...state,
                fields: {},
            };

        default:
            return state;
    }
}

export const onChangeClientForm = update => ({
    type:    ON_CHANGE_CLIENT_FORM,
    payload: update,
});

export const addError = error => ({
    type:    ADD_ERROR,
    payload: error,
    error:   true,
});

export const handleError = id => ({
    type:    HANDLE_ERROR,
    payload: id,
});

export const updateClient = (clientId, client) => ({
    type:    UPDATE_CLIENT,
    payload: { clientId, client },
});

export const updateClientSuccess = () => ({
    type: UPDATE_CLIENT_SUCCESS,
});
