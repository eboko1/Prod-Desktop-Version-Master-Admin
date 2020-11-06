/**
 * Constants
 * */
export const moduleName = 'clientRequisites';
const prefix = `cpb/${moduleName}`;

export const SET_EDIT_CLIENT_REQUISITE_ID = `${prefix}/SET_EDIT_CLIENT_REQUISITE_ID`;
export const SET_CREATE_CLIENT_REQUISITE = `${prefix}/SET_CREATE_CLIENT_REQUISITE`;

export const ON_CHANGE_CLIENT_REQUISITE_FORM = `${prefix}/ON_CHANGE_CLIENT_REQUISITE_FORM`;

export const UPDATE_CLIENT_REQUISITE = `${prefix}/UPDATE_CLIENT_REQUISITE`;
export const CREATE_CLIENT_REQUISITE = `${prefix}/CREATE_CLIENT_REQUISITE`;
export const DELETE_CLIENT_REQUISITE = `${prefix}/DELETE_CLIENT_REQUISITE`;

export const HIDE_FORMS = `${prefix}/HIDE_FORMS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:                    {},
    editClientRequisiteId:     null,
    createClientRequisiteForm: false,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_CLIENT_REQUISITE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case SET_EDIT_CLIENT_REQUISITE_ID:
            return {
                ...state,
                editClientRequisiteId:     payload,
                createClientRequisiteForm: false,
            };

        case SET_CREATE_CLIENT_REQUISITE:
            return {
                ...state,
                editClientRequisiteId:     void 0,
                createClientRequisiteForm: true,
            };

        case UPDATE_CLIENT_REQUISITE:
            return {
                ...state,
                editClientRequisiteId: null,
            };

        case CREATE_CLIENT_REQUISITE:
            return {
                ...state,
                createClientRequisiteForm: false,
            };

        case HIDE_FORMS:
            return {
                ...state,
                editClientRequisiteId:     void 0,
                createClientRequisiteForm: false,
            };

        default:
            return state;
    }
}

export const setCreateClientRequisiteForm = create => ({
    type:    SET_CREATE_CLIENT_REQUISITE,
    payload: create,
});

export const setEditClientRequisiteId = clientRequisiteId => ({
    type:    SET_EDIT_CLIENT_REQUISITE_ID,
    payload: clientRequisiteId,
});

export const onChangeClientRequisiteForm = update => ({
    type:    ON_CHANGE_CLIENT_REQUISITE_FORM,
    payload: update,
});

export const updateClientRequisite = (clientId, id, entity) => ({
    type:    UPDATE_CLIENT_REQUISITE,
    payload: { clientId, id, entity },
});

export const createClientRequisite = (clientId, entity) => ({
    type:    CREATE_CLIENT_REQUISITE,
    payload: { clientId, entity },
});

export const deleteClientRequisite = (clientId, id) => ({
    type:    DELETE_CLIENT_REQUISITE,
    payload: { clientId, id },
});

export const hideForms = () => ({
    type: HIDE_FORMS,
});
