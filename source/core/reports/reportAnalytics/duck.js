/**
 * Constants
 * */
export const moduleName = 'reportAnalytics';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_ANALYTICS = `${prefix}/FETCH_REPORT_ANALYTICS`;
export const FETCH_REPORT_ANALYTICS_SUCCESS = `${prefix}/FETCH_REPORT_ANALYTICS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    analytics: [],
    filter:    {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_ANALYTICS_SUCCESS:
            const {analytics} = payload;
            return {
                ...state,
                analytics: analytics
            };

        default:
            return state;
    }
}

export const fetchReportAnalytics = () => ({ 
    type:    FETCH_REPORT_ANALYTICS,
});

export const fetchReportAnalyticsSuccess = ({analytics}) => ({
    type:    FETCH_REPORT_ANALYTICS_SUCCESS,
    payload: {analytics},
});