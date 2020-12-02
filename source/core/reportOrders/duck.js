/**
 * Constants
 * */
export const moduleName = 'reportOrders';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_ORDERS = `${prefix}/FETCH_REPORT_ORDERS`;
export const FETCH_REPORT_ORDERS_SUCCESS = `${prefix}/FETCH_REPORT_ORDERS_SUCCESS`;

// export const FETCH_CASH_ORDER_ENTITY = `${prefix}/FETCH_CASH_ORDER_ENTITY`;
// export const FETCH_CASH_ORDER_ENTITY_SUCCESS = `${prefix}/FETCH_CASH_ORDER_ENTITY_SUCCESS`;

export const SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT = `${prefix}/SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT`;
export const SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT = `${prefix}/SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT`;
export const SET_REPORT_ORDERS_PAGE = `${prefix}/SET_REPORT_ORDERS_PAGE`;
// export const SET_CASH_ORDER_ENTITY_IS_FETCHING = `${prefix}/SET_CASH_ORDER_ENTITY_IS_FETCHING`;
// export const SET_CASH_ORDER_MODAL_MOUNTED = `${prefix}/SET_CASH_ORDER_MODAL_MOUNTED`;
// export const SET_FILTER_DATE = `${prefix}/SET_FILTER_DATE`;

/**
 * Reducer
 * */

const ReducerState = {
    tableData: [],
    stats: {},
    // cashOrderEntity: {},
    // cashOrderEntityIsFetching: false,
    // cashOrderModalMounted: false,
    filter:     {
        page: 1,
        // MRDsUntilDate: undefined,
    },
    options: {
        includeServicesDiscount: true,
        includeAppurtenanciesDiscount: true,
    },
    sort: {
        field: 'datetime',
        order: 'desc',
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_ORDERS_SUCCESS:
            const {tableData} = payload;
            return {
                ...state,
                tableData: tableData? tableData: state.tableData,
                // stats: stats? stats: state.stats
            };

        case SET_REPORT_ORDERS_PAGE: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    page: payload
                }
            };

        case SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT: 
            return {
                ...state,
                options:{
                    ...state.options,
                    includeServicesDiscount: payload
                }
            };

        case SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT: 
            return {
                ...state,
                options:{
                    ...state.options,
                    includeAppurtenanciesDiscount: payload
                }
            };

        default:
            return state;
    }
}

export const fetchReportOrders = () => ({ 
    type:    FETCH_REPORT_ORDERS,
});

export const fetchReportOrdersSuccess = ({tableData}) => ({
    type:    FETCH_REPORT_ORDERS_SUCCESS,
    payload: {tableData},
});

export const setReportOrdersPage = (page) => ({ 
    type:    SET_REPORT_ORDERS_PAGE,
    payload: page
});

export const setReportOrdersIncludeServicesDiscount = (val) => ({ 
    type:    SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT,
    payload: val
});

export const setReportOrdersIncludeAppurtenanciesDiscount = (val) => ({ 
    type:    SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT,
    payload: val
});