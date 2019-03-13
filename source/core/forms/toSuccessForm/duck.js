/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'toSuccessForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_TO_SUCCESS_FORM = `${prefix}/ON_CHANGE_TO_SUCCESS_FORM`;

/**
 * Reducer
 **/

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_TO_SUCCESS_FORM:
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

export const onChangeToSuccessForm = update => ({
    type:    ON_CHANGE_TO_SUCCESS_FORM,
    payload: update,
});
