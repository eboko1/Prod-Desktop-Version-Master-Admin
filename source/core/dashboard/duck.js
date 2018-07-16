import moment from 'moment';
/**
 * Constants
 * */
export const moduleName = 'dashboard';
const prefix = `cpb/${moduleName}`;

export const FETCH_DASHBOARD = `${prefix}/FETCH_DASHBOARD`;
export const FETCH_DASHBOARD_SUCCESS = `${prefix}/FETCH_DASHBOARD_SUCCESS`;

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
    beginDate: null, // for fetch
    date:      moment(),
    startDate: moment()
        .startOf('week')
        .isoWeekday(1),
    endDate: moment()
        .endOf('week')
        .isoWeekday(7),
    // postsLoad: {
    //     beginDate:       '', // 'YYYY-MM-DD'
    //     bussinessId:     null, // 0
    //     countOrders:     null, // 0
    //     dayName:         '', // monday
    //     loadCoefficient: null, // 0
    //     totalDuration:   '', // 00:00:00
    // },
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

        case FETCH_DASHBOARD:
            return {
                ...state,
                beginDate: payload.beginDate,
            };

        case FETCH_DASHBOARD_SUCCESS:
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
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

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

export const fetchDashboard = ({ beginDate, stations }) => ({
    type:    FETCH_DASHBOARD,
    payload: { beginDate, stations },
});

export const fetchDashboardSuccess = data => ({
    type:    FETCH_DASHBOARD_SUCCESS,
    payload: data,
});
