/*
This module contains actions for reportClientDebts module
*/

/**
 * Constants
 * */
export const moduleName = 'reportClientDebts';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT = `${prefix}/FETCH_REPORT`;
export const FETCH_REPORT_SUCCESS = `${prefix}/FETCH_REPORT_SUCCESS`;

export const FETCH_EXCEL_FILE_REPORT = `${prefix}/FETCH_EXCEL_FILE_REPORT`;
export const FETCH_EXCEL_FILE_REPORT_SUCCESS = `${prefix}/FETCH_EXCEL_FILE_REPORT_SUCCESS`;

export const SET_REPORT_PAGE = `${prefix}/SET_REPORT_PAGE`;
export const SET_REPORT_QUERY = `${prefix}/SET_REPORT_QUERY`;
export const SET_REPORT_OVERDUE_ONLY = `${prefix}/SET_REPORT_OVERDUE_ONLY`;

/**
 * Reducer
 * */
const ReducerState = {
    report:              [],
    stats:             {},
    filter: {
        page: 1,
        query: undefined
    },
    sort: {
        field: 'datetime',
        order: 'desc',
    }
};

// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_SUCCESS:
            return {
                ...state,
                report: payload,
            };
        
        case SET_REPORT_QUERY:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    query: payload
                }
            }

        case SET_REPORT_PAGE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: payload,
                },
            };

        case SET_REPORT_OVERDUE_ONLY:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    overdueOnly: payload,
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
export const selectFilter = ({
    reportClientDebts: { filter, sort },
}) => ({
    filter,
    sort
});

/**
 * Action Creators
 * */

export const fetchReport = () => ({
    type: FETCH_REPORT,
});

export const fetchReportSuccess = report => ({
    type:    FETCH_REPORT_SUCCESS,
    payload: report,
});

export const fetchExcelFileReport = () => ({
    type: FETCH_EXCEL_FILE_REPORT,
});

export const fetchExcelFileReportSuccess = () => ({
    type:    FETCH_EXCEL_FILE_REPORT_SUCCESS
});


export const setReportPage = (page) => ({
    type:    SET_REPORT_PAGE,
    payload: page,
});

export const setReportQuery = (query) => ({
    type:    SET_REPORT_QUERY,
    payload: query,
});

export const setReportOverdueOnly = (overdueOnly) => ({
    type:    SET_REPORT_OVERDUE_ONLY,
    payload: overdueOnly,
});

