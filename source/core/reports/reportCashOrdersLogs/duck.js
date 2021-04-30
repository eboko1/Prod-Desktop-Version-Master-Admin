/**
 * Constants
 * */
export const moduleName = 'reportCashOrdersLogs';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASH_ORDER_LOGS = `${prefix}/FETCH_CASH_ORDER_LOGS`;
export const FETCH_CASH_ORDER_LOGS_SUCCESS = `${prefix}/FETCH_CASH_ORDER_LOGS_SUCCESS`;

export const FETCH_CASH_ORDERS_LOGS_RECEIPT = `${prefix}/FETCH_CASH_ORDERS_LOGS_RECEIPT`;

export const SET_CASH_ORDERS_LOGS_PAGE = `${prefix}/SET_CASH_ORDERS_LOGS_PAGE`;

/**
 * Reducer
 * */

const ReducerState = {
    cashdeskLogs: [],
    stats: {
        totalRowsCount: 0,
    },
    filter:    {
        page: 1
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CASH_ORDER_LOGS_SUCCESS:
            const {cashdeskLogs, stats} = payload;
            return {
                ...state,
                cashdeskLogs: cashdeskLogs,
                stats: stats
            };

            case SET_CASH_ORDERS_LOGS_PAGE:
                const {page} = payload;
                return {
                    ...state,
                    filter: {
                        ...state.filter,
                        page: page
                    }
                };

        default:
            return state;
    }
}

/*Selectors*/

export const selectFilter = state => state[moduleName].filter;




/*Actions*/

export const fetchCashOrdersLogs = () => ({ 
    type:    FETCH_CASH_ORDER_LOGS,
});

export const fetchCashOrdersLogsSuccess = ({cashdeskLogs, stats}) => ({
    type:    FETCH_CASH_ORDER_LOGS_SUCCESS,
    payload: {cashdeskLogs, stats},
});

/**
 * Is used when user want do download receipt.
 * @param param.receiptId - Id of an receipt you want to get information about (example from cashdesk service: DEV_1536726327632732)
 * @returns 
 */
export const fetchCashOrdersLogsReceipt = ({receiptId}) => ({ 
    type:    FETCH_CASH_ORDERS_LOGS_RECEIPT,
    payload: {receiptId}
});

export const setCashOrdersLogsPage = ({page}) => {
    return function(dispatch) {
        dispatch({
            type: SET_CASH_ORDERS_LOGS_PAGE,
            payload: {page}
        });
        return dispatch(fetchCashOrdersLogs());
    }
};