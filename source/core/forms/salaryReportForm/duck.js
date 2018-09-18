/**
 * Constants
 * */
export const moduleName = 'salaryReport';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_SALARY_REPORT_FORM = `${prefix}/ON_CHANGE_SALARY_REPORT_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SALARY_REPORT_FORM:
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

export const onChangeSalaryReportForm = update => ({
    type:    ON_CHANGE_SALARY_REPORT_FORM,
    payload: update,
});
