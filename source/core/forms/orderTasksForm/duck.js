/**
 * Constants
 * */
export const moduleName = 'orderForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_ORDER_TASKS_FORM = `${prefix}/ON_CHANGE_ORDER_TASKS_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        // TODO: declare form fields model
    },
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_ORDER_TASKS_FORM:
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

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

// TODO: add form submit actions
export const onChangeOrderTasksForm = update => ({
    type:    ON_CHANGE_ORDER_TASKS_FORM,
    payload: update,
});
