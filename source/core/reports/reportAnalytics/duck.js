/**
 * Constants
 * */
 export const moduleName = 'reportAnalytics';
 const prefix = `cpb/${moduleName}`;
 
 export const FETCH_REPORT_ANALYTICS = `${prefix}/FETCH_REPORT_ANALYTICS`;
 export const FETCH_REPORT_ANALYTICS_SUCCESS = `${prefix}/FETCH_REPORT_ANALYTICS_SUCCESS`;
 
 export const DELETE_REPORT_ANALYTICS = `${prefix}/DELETE_REPORT_ANALYTICS`;
 export const DELETE_REPORT_ANALYTICS_SUCCESS = `${prefix}/DELETE_REPORT_ANALYTICS_SUCCESS`;
 
 export const RESET_ALL_REPORT_ANALYTICS = `${prefix}/RESET_ALL_REPORT_ANALYTICS`;
 export const RESET_ALL_REPORT_ANALYTICS_SUCCESS = `${prefix}/RESET_ALL_REPORT_ANALYTICS_SUCCESS`;
 
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
 
 export const deleteReportAnalytics = (analyticsId) => ({
     type: DELETE_REPORT_ANALYTICS,
     payload: {analyticsId}
 });
 
 //Make sync update actions after analytics was deleted
 export const deleteReportAnalyticsSuccess = () => {
     return function(dispatch) {
         return dispatch(fetchReportAnalytics()); //Update after deleting
     }
 };
 
 export const resetAllReportAnalytics = ({areYouSureToDeleteAll}) => ({
     type: RESET_ALL_REPORT_ANALYTICS,
     payload: {areYouSureToDeleteAll}
 });
 
 export const resetAllReportAnalyticsSuccess = () => {
     return function(dispatch) {
         return dispatch(fetchReportAnalytics()); //Update after resetting
     }
 };
 