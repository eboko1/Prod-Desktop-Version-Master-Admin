/**
 * Constants
 * */
 export const moduleName = 'reportCashOrdersLogs';
 const prefix = `cpb/${moduleName}`;
 
 export const FETCH_CASH_ORDER_LOGS = `${prefix}/FETCH_CASH_ORDER_LOGS`;
 export const FETCH_CASH_ORDER_LOGS_SUCCESS = `${prefix}/FETCH_CASH_ORDER_LOGS_SUCCESS`;
 
 /**
  * Reducer
  * */
 
 const ReducerState = {
     cashdeskLogs: [],
     filter:    {},
 };
 
 export default function reducer(state = ReducerState, action) {
     const { type, payload } = action;
 
     switch (type) {
         case FETCH_CASH_ORDER_LOGS_SUCCESS:
             const {cashdeskLogs} = payload;
             return {
                 ...state,
                 cashdeskLogs: cashdeskLogs
             };
 
         default:
             return state;
     }
 }
 
 export const fetchCashOrdersLogs = () => ({ 
     type:    FETCH_CASH_ORDER_LOGS,
 });
 
 export const fetchCashOrdersLogsSuccess = ({cashdeskLogs}) => ({
     type:    FETCH_CASH_ORDER_LOGS_SUCCESS,
     payload: {cashdeskLogs},
 });
 