/**
 * Constants
 * */
export const moduleName = 'roles';
const prefix = `cpb/${moduleName}`;

export const FETCH_ROLES = `${prefix}/FETCH_ROLES`;
export const FETCH_ROLES_SUCCESS = `${prefix}/FETCH_ROLES_SUCCESS`;
export const FETCH_ROLES_ERROR = `${prefix}/FETCH_ROLES_ERROR`;

export const SET_EDIT_ROLE_ID = `${prefix}/SET_EDIT_ROLE_ID`;
export const SET_CREATE_ROLE = `${prefix}/SET_CREATE_ROLE`;

export const ON_CHANGE_ROLE_FORM = `${prefix}/ON_CHANGE_ROLE_FORM`;

export const UPDATE_ROLE = `${prefix}/UPDATE_ROLE`;
export const CREATE_ROLE = `${prefix}/CREATE_ROLE`;
export const DELETE_ROLE = `${prefix}/DELETE_ROLE`;

export const HIDE_FORMS = `${prefix}/HIDE_FORMS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:         {},
    editRoleId:     null,
    createRoleForm: false,
    roles:          [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_ROLE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case FETCH_ROLES:
            return {
                ...state,
                editRoleId:     void 0,
                createRoleForm: false,
            };

        case FETCH_ROLES_SUCCESS:
            return {
                ...state,
                roles: payload,
            };

        case FETCH_ROLES_ERROR:
            return {
                ...state,
            };

        case SET_EDIT_ROLE_ID:
            return {
                ...state,
                editRoleId:     payload,
                createRoleForm: false,
            };

        case SET_CREATE_ROLE:
            return {
                ...state,
                editRoleId:     void 0,
                createRoleForm: true,
            };

        case UPDATE_ROLE:
            return {
                ...state,
                editRoleId: null,
            };

        case CREATE_ROLE:
            return {
                ...state,
                createRoleForm: false,
            };

        case HIDE_FORMS:
            return {
                ...state,
                editRoleId:     void 0,
                createRoleForm: false,
            };

        default:
            return state;
    }
}

export const setCreateRoleForm = create => ({
    type:    SET_CREATE_ROLE,
    payload: create,
});

export const setEditRoleId = roleId => ({
    type:    SET_EDIT_ROLE_ID,
    payload: roleId,
});

export const fetchRoles = id => ({
    type:    FETCH_ROLES,
    payload: { id },
});

export const fetchRolesSuccess = data => ({
    type:    FETCH_ROLES_SUCCESS,
    payload: data,
});

export const fetchRolesError = () => ({
    type: FETCH_ROLES_ERROR,
});

export const onChangeRoleForm = update => ({
    type:    ON_CHANGE_ROLE_FORM,
    payload: update,
});

export const updateRole = (packageId, id, entity) => ({
    type:    UPDATE_ROLE,
    payload: { packageId, id, entity },
});

export const createRole = (packageId, entity) => ({
    type:    CREATE_ROLE,
    payload: { packageId, entity },
});

export const deleteRole = (packageId, id) => ({
    type:    DELETE_ROLE,
    payload: { packageId, id },
});

export const hideForms = () => ({
    type: HIDE_FORMS,
});
