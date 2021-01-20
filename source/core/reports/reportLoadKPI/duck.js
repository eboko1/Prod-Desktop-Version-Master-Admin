/*
It is very importnant to use this ('YYYY/MM/DD') date format when fetching from server!!!
*/

import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'reportLoadKPI';
const prefix = `cpb/${moduleName}`;

export const FETCH_REPORT_LOAD_KPI = `${prefix}/FETCH_REPORT_LOAD_KPI`;
export const FETCH_REPORT_LOAD_KPI_SUCCESS = `${prefix}/FETCH_REPORT_LOAD_KPI_SUCCESS`;

export const SET_REPORT_LOAD_KPI_PAGE = `${prefix}/SET_REPORT_LOAD_KPI_PAGE`;

export const SET_REPORT_LOAD_KPI_QUERY = `${prefix}/SET_REPORT_LOAD_KPI_QUERY`;

export const SET_REPORT_LOAD_KPI_DONE_FROM_DATE = `${prefix}/SET_REPORT_LOAD_KPI_DONE_FROM_DATE`;
export const SET_REPORT_LOAD_KPI_DONE_TO_DATE = `${prefix}/SET_REPORT_LOAD_KPI_DONE_TO_DATE`;

const DEF_DATE_FORMAT = 'YYYY/MM/DD';


/**
 * Reducer
 * */

const ReducerState = {
    tableData: [],
    stats: {
        totalRowsCount: undefined,
        totalLaborsPlan: undefined,
        totalWorkingTime: undefined,
        totalStoppedTime: undefined,
        totalInternalParkingDuration: undefined,
        totalExternalParkingDuration: undefined,
        totalWorkPostParkingDuration: undefined,
        totalOtherParkingDuration: undefined,
    },
    filter:     {
        page: 1,
        query: undefined,
        doneFromDate: moment().startOf('month').format(DEF_DATE_FORMAT), //Set default creation date filter to serch,
        doneToDate: moment().endOf('month').format(DEF_DATE_FORMAT), //Set default creation date filter to serch,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_REPORT_LOAD_KPI_SUCCESS:
            const {tableData, stats} = payload;
            return {
                ...state,
                tableData: tableData? tableData: state.tableData,
                stats: stats? stats: state.stats
            };

        case SET_REPORT_LOAD_KPI_PAGE: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    page: payload
                }
            };

        case SET_REPORT_LOAD_KPI_QUERY: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    query: payload
                }
            };

        case SET_REPORT_LOAD_KPI_DONE_FROM_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    doneFromDate: payload
                }
            };

        case SET_REPORT_LOAD_KPI_DONE_TO_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    doneToDate: payload
                }
            };
                                                                                    
        default:
            return state;
    }
}

export const fetchReportLoadKPI = () => ({ 
    type:    FETCH_REPORT_LOAD_KPI,
});

export const fetchReportLoadKPISuccess = ({tableData, stats}) => ({
    type:    FETCH_REPORT_LOAD_KPI_SUCCESS,
    payload: {tableData, stats},
});

//Filters------------------------------------------------------------------------------------------------
export const setReportLoadKPIPage = (page) => ({ 
    type:    SET_REPORT_LOAD_KPI_PAGE,
    payload: page
});

export const setReportLoadKPIQuery = (query) => ({ 
    type:    SET_REPORT_LOAD_KPI_QUERY,
    payload: query
});

export const setReportLoadKPIDoneFromDate = (doneFromDate) => ({ 
    type:    SET_REPORT_LOAD_KPI_DONE_FROM_DATE,
    payload: doneFromDate
});

export const setReportLoadKPIDoneToDate = (doneToDate) => ({ 
    type:    SET_REPORT_LOAD_KPI_DONE_TO_DATE,
    payload: doneToDate
});

//-------------------------------------------------------------------------------------------------------