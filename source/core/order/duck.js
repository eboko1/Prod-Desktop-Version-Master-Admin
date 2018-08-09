/**
 * Constants
 * */
export const moduleName = 'order';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDER = `${prefix}/FETCH_ORDER`;
export const FETCH_ORDER_SUCCESS = `${prefix}/FETCH_ORDER_SUCCESS`;
export const FETCH_ORDER_FAIL = `${prefix}/FETCH_ORDER_FAIL`;

export const FETCH_REPORT = `${prefix}/FETCH_REPORT`;
export const FETCH_REPORT_SUCCESS = `${prefix}/FETCH_REPORT_SUCCESS`;
export const FETCH_REPORT_FAIL = `${prefix}/FETCH_REPORT_FAIL`;

// reports
export const GET_REPORT = `${prefix}/GET_REPORT`;
export const GET_REPORT_SUCCESS = `${prefix}/GET_REPORT_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    order:         {},
    tasks:         [],
    orderComments: [],
    allServices:   [],
    orderServices: [],
    orderDetails:  [],
    clients:       [],
    managers:      [],
    employees:     [],
    vehicles:      [],
    calls:         [],
    stations:      [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ORDER_SUCCESS:
            return {
                ...state,
                ...payload,
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
// order
export const fetchOrder = id => ({
    type:    FETCH_ORDER,
    payload: id,
});

export const fetchOrderSuccess = order => ({
    type:    FETCH_ORDER_SUCCESS,
    payload: order,
});

export const fetchOrderFail = error => ({
    type:    FETCH_ORDER_FAIL,
    payload: error,
    error:   true,
});

// report
export const fetchReport = report => ({
    type:    FETCH_REPORT,
    payload: report,
});

export const fetchReportSuccess = report => ({
    type:    FETCH_ORDER_SUCCESS,
    payload: report,
});

export const fetchReportFail = error => ({
    type:    FETCH_ORDER_FAIL,
    payload: error,
    error:   true,
});

export const getReport = report => ({
    type:    GET_REPORT,
    payload: report,
});

export const getReportSuccess = () => ({
    type: GET_REPORT_SUCCESS,
});
