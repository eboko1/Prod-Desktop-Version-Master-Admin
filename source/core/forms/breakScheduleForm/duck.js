/**
 * Constants
 * */
export const moduleName = 'breakScheduleForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_BREAK_SCHEDULE_FORM = `${prefix}/ON_CHANGE_BREAK_SCHEDULE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_BREAK_SCHEDULE_FORM:
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

export const onChangeBreakScheduleForm = update => ({
    type:    ON_CHANGE_BREAK_SCHEDULE_FORM,
    payload: update,
});
