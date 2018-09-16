/**
 * Constants
 * */
export const moduleName = 'scheduleForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_SCHEDULE_FORM = `${prefix}/ON_CHANGE_SCHEDULE_FORM`;
export const RESET_FIELDS = `${prefix}/RESET_FIELDS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SCHEDULE_FORM:
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

export const onChangeScheduleForm = update => ({
    type:    ON_CHANGE_SCHEDULE_FORM,
    payload: update,
});

export const resetFields = () => ({
    type: RESET_FIELDS,
});
