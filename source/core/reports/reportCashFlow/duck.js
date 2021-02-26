import {analyticsLevels} from 'core/forms/reportAnalyticsForm/duck';

/**
 * Constants
 * */
export const moduleName = 'reportCashFlow';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_CASH_FLOW = `${prefix}/FETCH_REPORT_CASH_FLOW`;
export const FETCH_REPORT_CASH_FLOW_SUCCESS = `${prefix}/FETCH_REPORT_ANALYTICS_SUCCESS`;

export const FETCH_ANALYTICS = `${prefix}/FETCH_ANALYTICS`;
export const FETCH_ANALYTICS_SUCCESS = `${prefix}/FETCH_ANALYTICS_SUCCESS`;

export const FETCH_CASHBOXES = `${prefix}/FETCH_CASHBOXES`;
export const FETCH_CASHBOXES_SUCCESS = `${prefix}/FETCH_CASHBOXES_SUCCESS`;

export const SET_CASH_ORDER_FROM_DATE = `${prefix}/SET_CASH_ORDER_FROM_DATE`;
export const SET_CASH_ORDER_TO_DATE = `${prefix}/SET_CASH_ORDER_TO_DATE`;
export const SET_ANALYTICS_FETCHING_STATE = `${prefix}/SET_ANALYTICS_FETCHING_STATE`;
export const SET_CASHBOXES_FETCHING_STATE = `${prefix}/SET_CASHBOXES_FETCHING_STATE`;

/**
 * Use this to cast date for server, it uses date in that format
 */
export const DEFAULT_DATE_FORMAT = 'YYYY.MM.DD';

/**
 * Reducer
 * */

const ReducerState = {
    tableData: [],
    stats: {},
    analytics: [],
    cashboxes: [],
    analyticsIsFetching: false,
    cashboxesIsFetching: false,
    analyticsFilters: {
        level: analyticsLevels.analytics
    },
    filters: {
        createdFromDate: undefined,
        createdToDate: undefined,
        cashboxId: undefined,
        analyticsUniqueId: undefined,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_CASH_FLOW_SUCCESS:
            const {tableData, stats} = payload;
            return {
                ...state,
                tableData: tableData,
                stats: stats
            };

        case FETCH_ANALYTICS_SUCCESS: 
            const { analytics } = payload;
            return {
                ...state,
                analytics: analytics
            };

        case FETCH_CASHBOXES_SUCCESS:
            const {cashboxes} = payload;
            return {
                ...state,
                cashboxes: cashboxes
            };

        case SET_CASH_ORDER_FROM_DATE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    createdFromDate: payload
                }
            };

        case SET_CASH_ORDER_TO_DATE:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    createdToDate: payload
                }
            };

        case SET_ANALYTICS_FETCHING_STATE:
            return {
                ...state,
                analyticsIsFetching: payload
            };

        case SET_CASHBOXES_FETCHING_STATE:
            return {
                ...state,
                cashboxesIsFetching: payload
            };

        default:
            return state;
    }
}

/**
 * Selectors
 */

export const selectAnalyticsFilters = (state) => state[moduleName].analyticsFilters

/**
 * Action creators
 */

export const fetchReportCashFlow = () => ({ 
    type:    FETCH_REPORT_CASH_FLOW,
});

export const fetchReportCashFlowSuccess = ({tableData, stats}) => ({
    type:    FETCH_REPORT_CASH_FLOW_SUCCESS,
    payload: {tableData, stats},
});

/**
 * Fetch analytics for filter
 */
export const fetchAnalytics = () => ({
    type: FETCH_ANALYTICS
});

export const fetchAnalyticsSuccess = ({analytics}) => ({
    type: FETCH_ANALYTICS_SUCCESS,
    payload: {analytics}
});

/**
 * Fetch cashboxes for filter
 */
export const fetchCashboxes = () => ({
    type: FETCH_CASHBOXES
});

export const fetchCashboxesSuccess = ({cashboxes}) => ({
    type: FETCH_CASHBOXES_SUCCESS,
    payload: {cashboxes}
});

export const setCashOrderFromDate = (strDate) => ({
    type: SET_CASH_ORDER_FROM_DATE,
    payload: strDate
});

export const setCashOrderToDate = (strDate) => ({
    type: SET_CASH_ORDER_TO_DATE,
    payload: strDate
})

export const setAnalyticsFetchingState = (val) => ({
    type: SET_ANALYTICS_FETCHING_STATE,
    payload: val
});

export const setCashboxesFetchingState = (val) => ({
    type: SET_CASHBOXES_FETCHING_STATE,
    payload: val
}); 