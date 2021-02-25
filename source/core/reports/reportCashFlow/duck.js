/**
 * Constants
 * */
export const moduleName = 'reportCashFlow';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_CASH_FLOW = `${prefix}/FETCH_REPORT_CASH_FLOW`;
export const FETCH_REPORT_CASH_FLOW_SUCCESS = `${prefix}/FETCH_REPORT_ANALYTICS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    tableData: [],
    stats: {},
    filter:    {},
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

        default:
            return state;
    }
}

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