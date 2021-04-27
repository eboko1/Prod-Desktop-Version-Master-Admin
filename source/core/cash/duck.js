import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'cash';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASHBOXES = `${prefix}/FETCH_CASHBOXES`;
export const FETCH_CASHBOXES_SUCCESS = `${prefix}/FETCH_CASHBOXES_SUCCESS`;

export const FETCH_CASH_ORDERS = `${prefix}/FETCH_CASH_ORDERS`;
export const FETCH_CASH_ORDERS_SUCCESS = `${prefix}/FETCH_CASH_ORDERS_SUCCESS`;

export const FETCH_CASHBOXES_BALANCE = `${prefix}/FETCH_CASHBOXES_BALANCE`;
export const FETCH_CASHBOXES_BALANCE_SUCCESS = `${prefix}/FETCH_CASHBOXES_BALANCE_SUCCESS`;

export const FETCH_CASHBOXES_ACTIVITY = `${prefix}/FETCH_CASHBOXES_ACTIVITY`;
export const FETCH_CASHBOXES_ACTIVITY_SUCCESS = `${prefix}/FETCH_CASHBOXES_ACTIVITY_SUCCESS`;

export const FETCH_ANALYTICS = `${prefix}/FETCH_ANALYTICS`;
export const FETCH_ANALYTICS_SUCCESS = `${prefix}/FETCH_ANALYTICS_SUCCESS`;

export const CREATE_CASHBOX = `${prefix}/CREATE_CASHBOX`;
export const CREATE_CASHBOX_SUCCESS = `${prefix}/CREATE_CASHBOX_SUCCESS`;

export const DELETE_CASHBOX = `${prefix}/DELETE_CASHBOX`;
export const DELETE_CASHBOX_SUCCESS = `${prefix}/DELETE_CASHBOX_SUCCESS`;

export const SET_CASH_ORDERS_FILTERS = `${prefix}/SET_CASH_ORDERS_FILTERS`;
export const SET_CASH_ORDERS_PAGE = `${prefix}/SET_CASH_ORDERS_PAGE`;
export const SET_CASH_ACCOUNTING_FILTERS = `${prefix}/SET_CASH_ACCOUNTING_FILTERS`;

export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;
export const SET_ANALYTICS_FETCHING_STATE = `${prefix}/SET_ANALYTICS_FETCHING_STATE`;

export const PRINT_CASH_ORDERS = `${prefix}/PRINT_CASH_ORDERS`;
export const PRINT_CASH_ORDERS_SUCCESS = `${prefix}/PRINT_CASH_ORDERS_SUCCESS`;

//Робота з касами які підключені до податкової
export const OPEN_SHIFT = `${prefix}/OPEN_SHIFT`; //Відкрити зміну(касу) для здійснення внесень коштів в неї(валідне тільки для кас з РРО)
export const OPEN_SHIFT_SUCCESS = `${prefix}/OPEN_SHIFT_SUCCESS`;

export const CLOSE_SHIFT = `${prefix}/CLOSE_SHIFT`; //Закрити зміну(касу), валідне тільки для кас з РРО
export const CLOSE_SHIFT_SUCCESS = `${prefix}/CLOSE_SHIFT_SUCCESS`;

export const SERVICE_INPUT = `${prefix}/SERVICE_INPUT`; //Внести гроші в касу
export const SERVICE_INPUT_SUCCESS = `${prefix}/SERVICE_INPUT_SUCCESS`;

export const FETCH_X_REPORT = `${prefix}/FETCH_X_REPORT`; //Отримати xReport
export const FETCH_X_REPORT_SUCCESS = `${prefix}/FETCH_X_REPORT_SUCCESS`;

export const REGISTER_CASH_ORDER_IN_CASHDESK = `${prefix}/REGISTER_CASH_ORDER_IN_CASHDESK`;

export const SEND_MAIL_WITH_RECEIPT = `${prefix}/SEND_MAIL_WITH_RECEIPT`;

/**
 * Reducer
 * */
const ReducerState = {
    cashboxes:         [],
    analytics:         [],
    activity:          [],
    balance:           [],
    stats:             {},
    cashOrders:        [],
    cashOrdersFilters: {
        startDate: moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        query:   '',
        analyticsUniqueId: undefined,
        page:    1,
    },
    cashAccountingFilters: {
        date:      moment(),
        startDate: moment()
            .startOf('month')
            .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    },
    analyticsFetchingState: false,
};
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CASHBOXES_SUCCESS:
            return {
                ...state,
                cashboxes: payload,
            };

        case FETCH_CASHBOXES_BALANCE_SUCCESS:
            return {
                ...state,
                balance: [ ...payload ],
            };

        case FETCH_CASHBOXES_ACTIVITY_SUCCESS:
            return {
                ...state,
                activity: [ ...payload ],
            };

        case FETCH_ANALYTICS_SUCCESS:
            return {
                ...state,
                analytics: payload
            };

        case CREATE_CASHBOX_SUCCESS:
            return {
                ...state,
                cashboxes: [ ...state.cashboxes, payload ],
            };

        case DELETE_CASHBOX_SUCCESS:
            return {
                ...state,
                cashboxes: [ ...state.cashboxes, payload ],
            };

        case FETCH_CASH_ORDERS:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDERS_SUCCESS:
            return {
                ...state,
                cashOrders: payload.list,
                stats:      payload.stats,
            };

        case SET_CASH_ORDERS_FILTERS:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    ...payload,
                    page: 1,
                },
            };

        case SET_CASH_ORDERS_PAGE:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    page: payload,
                },
            };

        case SET_SEARCH_QUERY:
            return {
                ...state,
                cashOrdersFilters: {
                    ...state.cashOrdersFilters,
                    query: payload,
                    page:  1,
                },
            };

        case SET_CASH_ACCOUNTING_FILTERS:
            return {
                ...state,
                cashAccountingFilters: {
                    ...state.cashAccountingFilters,
                    ...payload,
                },
            };

        case SET_ANALYTICS_FETCHING_STATE: 
            return {
                ...state,
                analyticsFetchingState: payload
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectCashStats = state => ({
    increase: state.cash.stats.increase,
    decrease: state.cash.stats.decrease,
    balance:  Number(state.cash.stats.increase - state.cash.stats.decrease),
});
export const selectCashOrdersFilters = state => state.cash.cashOrdersFilters;

export const selectCashAccountingFilters = state =>
    state.cash.cashAccountingFilters;

/**
 * Action Creators
 * */

// cashboxes
export const fetchCashboxes = () => ({
    type: FETCH_CASHBOXES,
});

export const fetchCashboxesSuccess = cashboxes => ({
    type:    FETCH_CASHBOXES_SUCCESS,
    payload: cashboxes,
});

export const fetchCashboxesBalance = () => ({
    type: FETCH_CASHBOXES_BALANCE,
});

export const fetchCashboxesBalanceSuccess = balance => ({
    type:    FETCH_CASHBOXES_BALANCE_SUCCESS,
    payload: balance,
});

export const fetchCashboxesActivity = () => ({
    type: FETCH_CASHBOXES_ACTIVITY,
});

export const fetchCashboxesActivitySuccess = activity => ({
    type:    FETCH_CASHBOXES_ACTIVITY_SUCCESS,
    payload: activity,
});

export const fetchAnalytics = () => ({
    type: FETCH_ANALYTICS,
});

export const fetchAnalyticsSuccess = (analytics) => ({
    type: FETCH_ANALYTICS_SUCCESS,
    payload: analytics
});

export const createCashbox = cashbox => ({
    type:    CREATE_CASHBOX,
    payload: cashbox,
});

export const createCashboxSuccess = cashboxes => ({
    type:    CREATE_CASHBOX_SUCCESS,
    payload: cashboxes,
});

export const deleteCashbox = id => ({
    type:    DELETE_CASHBOX,
    payload: id,
});

export const deleteCashboxSuccess = cashbox => ({
    type:    DELETE_CASHBOX_SUCCESS,
    payload: cashbox,
});

export const setCashOrdersFilters = filters => ({
    type:    SET_CASH_ORDERS_FILTERS,
    payload: filters,
});

export const setCashOrdersPage = ({ page }) => ({
    type:    SET_CASH_ORDERS_PAGE,
    payload: page,
});

export const setCashAccountingFilters = filters => ({
    type:    SET_CASH_ACCOUNTING_FILTERS,
    payload: filters,
});


export const setAnalyticsFetchingState = (val) => ({
    type: SET_ANALYTICS_FETCHING_STATE,
    payload: val
});

// cash orders

export const fetchCashOrders = filters => ({
    type:    FETCH_CASH_ORDERS,
    payload: filters,
});

export const fetchCashOrdersSuccess = cashOrders => ({
    type:    FETCH_CASH_ORDERS_SUCCESS,
    payload: cashOrders,
});

export const printCashOrder = () => ({
    type: PRINT_CASH_ORDERS,
});

export const printCashOrderSuccess = doc => ({
    type:    PRINT_CASH_ORDERS_SUCCESS,
    payload: doc,
});

export const setSearchQuery = searchQuery => ({
    type:    SET_SEARCH_QUERY,
    payload: searchQuery,
});

//RST cashboxes

export const openShift = (cashboxId) => ({
    type: OPEN_SHIFT,
    payload: cashboxId
});

export const openShiftSuccess = () => ({
    type: OPEN_SHIFT_SUCCESS,
});

export const closeShift = (cashboxId) => ({
    type: CLOSE_SHIFT,
    payload: cashboxId
});

export const closeShiftSuccess = () => ({
    type: CLOSE_SHIFT_SUCCESS,
});

/**
 * Внести гроші в касу
 * @returns 
 */
export const serviceInput = ({cashboxId, serviceInputSum}) => ({
    type: SERVICE_INPUT,
    payload: {cashboxId, serviceInputSum}
});

export const serviceInputSuccess = () => ({
    type: SERVICE_INPUT_SUCCESS,
});

export const fetchXReport = (cashboxId) => ({
    type: FETCH_X_REPORT,
    payload: cashboxId
});

export const fetchXReportSuccess = () => ({
    type: FETCH_X_REPORT_SUCCESS,
});

export const registerCashOrderInCashdesk = (cashOrderId) => ({
    type: REGISTER_CASH_ORDER_IN_CASHDESK,
    payload: cashOrderId
});

/**
 * Send email to receivers, that mail contains informatin abot order RTS transactions(sells using RST)
 * @param {Object} params
 * @param {String[]} params.receivers - Array of receivers, email strings like [test@test.com, ...]
 * @param {String|Number} params.cashOrderId - Cash order to generate data for
 * @returns 
 */
export const sendMailWithReceipt = ({receivers, cashOrderId}) => ({
    type: SEND_MAIL_WITH_RECEIPT,
    payload: {receivers, cashOrderId}
});