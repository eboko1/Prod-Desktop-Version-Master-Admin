/**
 * Constants
 * */
export const moduleName = 'breakScheduleForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_BREAK_SCHEDULE_FORM = `${prefix}/ON_CHANGE_BREAK_SCHEDULE_FORM`;
export const RESET_FIELDS = `${prefix}/RESET_FIELDS`;

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

        case RESET_FIELDS:
            return {
                ...state,
                fields: {},
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

export const resetFields = () => ({
    type: RESET_FIELDS,
});
