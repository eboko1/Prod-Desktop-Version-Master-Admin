/**
 * Constants
 * */
export const moduleName = 'managerRole';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_MANAGER_ROLE_FORM = `${prefix}/ON_CHANGE_MANAGER_ROLE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_MANAGER_ROLE_FORM:
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

export const onChangeManagerRoleForm = update => ({
    type:    ON_CHANGE_MANAGER_ROLE_FORM,
    payload: update,
});
