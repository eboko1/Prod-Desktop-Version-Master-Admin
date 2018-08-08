/**
 * Constants
 * */
export const moduleName = 'orderTaskForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_ORDER_TASKS_FORM = `${prefix}/ON_CHANGE_ORDER_TASKS_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    
    fields: {
        progressStatus: {value: void 0, name: 'progressStatus'},
        priority:       {value: void 0, name: 'priority'},
        responsable:    {value: void 0, name: 'responsable'},
        post:           {value: void 0, name: 'post'},
        deadlineDate:   {value: void 0, name: 'deadlineDate'},
        comment:        {value: void 0, name: 'comment'},
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
