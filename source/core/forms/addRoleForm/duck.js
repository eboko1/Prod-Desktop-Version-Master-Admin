/**
 * Constants
 * */
export const moduleName = 'addRole';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_ROLE_FORM = `${prefix}/ON_CHANGE_ROLE_FORM`;


/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
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

        default:
            return state;
    }
}

export const onChangeRoleForm = update => ({
    type:    ON_CHANGE_ROLE_FORM,
    payload: update,
});
