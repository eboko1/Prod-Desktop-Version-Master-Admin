/**
 * Constants
 * */
export const moduleName = 'addClientRequisite';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_CLIENT_REQUISITE_FORM = `${prefix}/ON_CHANGE_CLIENT_REQUISITE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
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

        default:
            return state;
    }
}

export const onChangeClientRequisiteForm = update => ({
    type:    ON_CHANGE_CLIENT_REQUISITE_FORM,
    payload: update,
});
