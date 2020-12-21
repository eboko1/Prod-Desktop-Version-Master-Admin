/*
It is very importnant to use this ('YYYY/MM/DD') date format when fetching from server!!!
*/

import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'reportOrders';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_ORDERS = `${prefix}/FETCH_REPORT_ORDERS`;
export const FETCH_REPORT_ORDERS_SUCCESS = `${prefix}/FETCH_REPORT_ORDERS_SUCCESS`;

export const FETCH_REPORT_ORDERS_FILTER_OPTIONS = `${prefix}/FETCH_REPORT_ORDERS_FILTER_OPTIONS`;
export const FETCH_REPORT_ORDERS_FILTER_OPTIONS_SUCCESS = `${prefix}/FETCH_REPORT_ORDERS_FILTER_OPTIONS_SUCCESS`;

export const SET_REPORT_ORDERS_ALL_FILTERS = `${prefix}/SET_REPORT_ORDERS_ALL_FILTERS`;

export const SET_REPORT_ORDERS_PAGE = `${prefix}/SET_REPORT_ORDERS_PAGE`;

export const SET_REPORT_ORDERS_QUERY = `${prefix}/SET_REPORT_ORDERS_QUERY`;

export const SET_REPORT_ORDERS_STATUS = `${prefix}/SET_REPORT_ORDERS_STATUS`;

export const SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT = `${prefix}/SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT`;
export const SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT = `${prefix}/SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT`;

export const SET_REPORT_ORDERS_CREATION_FROM_DATE = `${prefix}/SET_REPORT_ORDERS_CREATION_FROM_DATE`;
export const SET_REPORT_ORDERS_CREATION_TO_DATE = `${prefix}/SET_REPORT_ORDERS_CREATION_TO_DATE`;

export const SET_REPORT_ORDERS_APPOINTMENT_FROM_DATE = `${prefix}/SET_REPORT_ORDERS_APPOINTMENT_FROM_DATE`;
export const SET_REPORT_ORDERS_APPOINTMENT_TO_DATE = `${prefix}/SET_REPORT_ORDERS_APPOINTMENT_TO_DATE`;

export const SET_REPORT_ORDERS_DONE_FROM_DATE = `${prefix}/SET_REPORT_ORDERS_DONE_FROM_DATE`;
export const SET_REPORT_ORDERS_DONE_TO_DATE = `${prefix}/SET_REPORT_ORDERS_DONE_TO_DATE`;

const DEF_DATE_FORMAT = 'YYYY/MM/DD';


/**
 * Reducer
 * */

const ReducerState = {
    tableData: [],
    stats: {},
    filter:     {
        page: 1,
        query: undefined,
        status: 'success', //Default status to search
        creationFromDate: undefined,
        creationToDate: undefined,
        appointmentFromDate: undefined,
        appointmentToDate: undefined,
        doneFromDate: moment().startOf('month').format(DEF_DATE_FORMAT), //Set default creation date filter to serch
        doneToDate: moment().endOf('month').format(DEF_DATE_FORMAT), //Set default creation date filter to serch

        appurtenanciesResponsibleId: undefined,
        mechanicId: undefined,
        managerId: undefined,
        requisiteId: undefined,
        stationNum: undefined,
    },
    options: {
        includeServicesDiscount: true,
        includeAppurtenanciesDiscount: true,
    },
    sort: {
        field: 'datetime',
        order: 'desc',
    },
    //This value is used to save dropdown options, for example select employee or station num
    filterOptions: {

    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_ORDERS_SUCCESS:
            const {tableData, stats} = payload;
            return {
                ...state,
                tableData: tableData? tableData: state.tableData,
                stats: stats? stats: state.stats
            };

        case FETCH_REPORT_ORDERS_FILTER_OPTIONS_SUCCESS:
            return {
                ...state,
                filterOptions: {
                    ...state.filterOptions,
                    ...payload
                }
            };

        //Filter-------------------------------------------------------------------------------------------------
        case SET_REPORT_ORDERS_PAGE: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    page: payload
                }
            };

        case SET_REPORT_ORDERS_QUERY: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    query: payload
                }
            };

        case SET_REPORT_ORDERS_STATUS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    status: payload
                }
            };


        case SET_REPORT_ORDERS_CREATION_FROM_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    creationFromDate: payload
                }
            };

        case SET_REPORT_ORDERS_CREATION_TO_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    creationToDate: payload
                }
            };

        case SET_REPORT_ORDERS_APPOINTMENT_FROM_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    appointmentFromDate: payload
                }
            };

        case SET_REPORT_ORDERS_APPOINTMENT_TO_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    appointmentToDate: payload
                }
            };

        case SET_REPORT_ORDERS_DONE_FROM_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    doneFromDate: payload
                }
            };

        case SET_REPORT_ORDERS_DONE_TO_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    doneToDate: payload
                }
            };
                                                                                    
        //--------------------------------------------------------------------------------------------------------

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

        case SET_REPORT_ORDERS_ALL_FILTERS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...payload
                }
            };

        default:
            return state;
    }
}

export const fetchReportOrders = () => ({ 
    type:    FETCH_REPORT_ORDERS,
});

export const fetchReportOrdersSuccess = ({tableData, stats}) => ({
    type:    FETCH_REPORT_ORDERS_SUCCESS,
    payload: {tableData, stats},
});

export const fetchReportOrdersFilterOptions = () => ({ 
    type:    FETCH_REPORT_ORDERS_FILTER_OPTIONS,
});

export const fetchReportOrdersFilterOptionsSuccess = (filterOptions) => ({
    type:    FETCH_REPORT_ORDERS_FILTER_OPTIONS_SUCCESS,
    payload: filterOptions,
});

//Filter-------------------------------------------------------------------------------------------------
export const setReportOrdersPage = (page) => ({ 
    type:    SET_REPORT_ORDERS_PAGE,
    payload: page
});

export const setReportOrdersQuery = (query) => ({ 
    type:    SET_REPORT_ORDERS_QUERY,
    payload: query
});

export const setReportOrdersStatus = (status) => ({ 
    type:    SET_REPORT_ORDERS_STATUS,
    payload: status
});

export const setReportOrdersCreationFromDate = (creationFromDate) => ({ 
    type:    SET_REPORT_ORDERS_CREATION_FROM_DATE,
    payload: creationFromDate
});

export const setReportOrdersCreationToDate = (creationToDate) => ({ 
    type:    SET_REPORT_ORDERS_CREATION_TO_DATE,
    payload: creationToDate
});

export const setReportOrdersAppointmentFromDate = (appointmentFromDate) => ({ 
    type:    SET_REPORT_ORDERS_APPOINTMENT_FROM_DATE,
    payload: appointmentFromDate
});

export const setReportOrdersAppointmentToDate = (appointmentToDate) => ({ 
    type:    SET_REPORT_ORDERS_APPOINTMENT_TO_DATE,
    payload: appointmentToDate
});

export const setReportOrdersDoneFromDate = (doneFromDate) => ({ 
    type:    SET_REPORT_ORDERS_DONE_FROM_DATE,
    payload: doneFromDate
});

export const setReportOrdersDoneToDate = (doneToDate) => ({ 
    type:    SET_REPORT_ORDERS_DONE_TO_DATE,
    payload: doneToDate
});

//-------------------------------------------------------------------------------------------------------

export const setReportOrdersIncludeServicesDiscount = (val) => ({ 
    type:    SET_REPORT_ORDERS_INCLUDE_SERVICES_DISCOUNT,
    payload: val
});

export const setReportOrdersIncludeAppurtenanciesDiscount = (val) => ({ 
    type:    SET_REPORT_ORDERS_INCLUDE_APPURTENANCIES_DISCOUNT,
    payload: val
});

//Override existing filters
export const setReportOrdersAllFilters = (filters) => ({
    type: SET_REPORT_ORDERS_ALL_FILTERS,
    payload: filters
});