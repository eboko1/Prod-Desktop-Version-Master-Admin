import moment from 'moment';
// import { createSelector } from 'reselect';
/**
 * Constants
 * */
export const moduleName = 'dashboard';
const prefix = `cpb/${moduleName}`;

export const INIT_DASHBOARD = `${prefix}/INIT_DASHBOARD`;
export const INIT_DASHBOARD_SUCCESS = `${prefix}/INIT_DASHBOARD_SUCCESS`;

export const FETCH_DASHBOARD = `${prefix}/FETCH_DASHBOARD`;
export const FETCH_DASHBOARD_SUCCESS = `${prefix}/FETCH_DASHBOARD_SUCCESS`;

export const FETCH_DASHBOARD_CALENDAR = `${prefix}/FETCH_DASHBOARD_CALENDAR`;
export const FETCH_DASHBOARD_CALENDAR_SUCCESS = `${prefix}/FETCH_DASHBOARD_CALENDAR_SUCCESS`;

export const FETCH_DASHBOARD_STATIONS = `${prefix}/FETCH_DASHBOARD_STATIONS`;
export const FETCH_DASHBOARD_STATIONS_SUCCESS = `${prefix}/FETCH_DASHBOARD_STATIONS_SUCCESS`;

export const DROP_DASHBOARD_ORDER = `${prefix}/DROP_DASHBOARD_ORDER}`;
export const DROP_DASHBOARD_ORDER_SUCCESS = `${prefix}/DROP_DASHBOARD_ORDER_SUCCESS}`;

export const SET_DASHBOARD_MODE = `${prefix}/SET_DASHBOARD_MODE`;
export const SET_DASHBOARD_DATE = `${prefix}/SET_DASHBOARD_DATE`;
export const SET_DASHBOARD_WEEK_DATES = `${prefix}/SET_DASHBOARD_WEEK_DATES`;

/**
 * Reducer
 * */

const ReducerState = {
    beginTime: null,
    endTime:   null,
    days:      [],
    orders:    [],
    stations:  [],
    mode:      'calendar',
    schedule:  {},
    beginDate: null, // for fetch
    date:      moment(),
    startDate: moment()
        .startOf('week')
        .isoWeekday(1),
    endDate: moment()
        .endOf('week')
        .isoWeekday(7),
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_DASHBOARD_MODE:
            return {
                ...state,
                mode: payload,
            };

        case SET_DASHBOARD_DATE:
            return {
                ...state,
                date: payload,
            };

        case SET_DASHBOARD_WEEK_DATES:
            return {
                ...state,
                startDate: payload.startDate,
                endDate:   payload.endDate,
            };

        case INIT_DASHBOARD:
            return {
                ...state,
                beginDate: payload.beginDate,
            };

        case INIT_DASHBOARD_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        // case FETCH_DASHBOARD:
        //     return {
        //         ...state,
        //         beginDate: payload.beginDate,
        //     };

        case FETCH_DASHBOARD_CALENDAR_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case FETCH_DASHBOARD_STATIONS_SUCCESS:
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
// export const selectDashboardMode = state =>
//     createSelector(stateSelector, state => {
//         state.dashboard.mode;
//     });
export const selectDashboardMode = state => state.dashboard.mode;
export const selectDashboardDate = state => state.dashboard.date;
export const selectDashboardStartDate = state => state.dashboard.startDate;
export const selectDashboardEndDate = state => state.dashboard.endDate;
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export const initDashboard = ({ stations, beginDate }) => ({
    type:    INIT_DASHBOARD,
    payload: { stations, beginDate },
});

export const initDashboardSuccess = data => ({
    type:    INIT_DASHBOARD_SUCCESS,
    payload: data,
});

export const fetchDashboard = mode => ({
    type:    FETCH_DASHBOARD,
    payload: mode,
});

export const fetchDashboardCalendar = () => ({
    type: FETCH_DASHBOARD_CALENDAR,
});

export const fetchDashboardStaions = () => ({
    type: FETCH_DASHBOARD_STATIONS,
});

export const fetchDashboardSuccess = data => ({
    type:    FETCH_DASHBOARD_SUCCESS,
    payload: data,
});

export const fetchDashboardCalendarSuccess = data => ({
    type:    FETCH_DASHBOARD_CALENDAR_SUCCESS,
    payload: data,
});

export const fetchDashboardStationsSuccess = data => ({
    type:    FETCH_DASHBOARD_STATIONS_SUCCESS,
    payload: data,
});

export const setDashboardMode = mode => ({
    type:    SET_DASHBOARD_MODE,
    payload: mode,
});

export const setDashboardDate = date => ({
    type:    SET_DASHBOARD_DATE,
    payload: date,
});

export const setDashboardWeekDates = ({ startDate, endDate }) => ({
    type:    SET_DASHBOARD_WEEK_DATES,
    payload: { startDate, endDate },
});

export const dropDashboardOrder = () => ({
    type: DROP_DASHBOARD_ORDER,
});

export const dropDashboardOrderSuccess = () => ({
    type: DROP_DASHBOARD_ORDER_SUCCESS,
});
