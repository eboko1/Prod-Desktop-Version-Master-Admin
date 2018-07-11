/**
 * Constants
 * */
export const moduleName = 'dashboard';
const prefix = `cpb/${moduleName}`;

export const FETCH_DASHBOARD = `${prefix}/FETCH_DASHBOARD`;
export const FETCH_DASHBOARD_SUCCESS = `${prefix}/FETCH_DASHBOARD_SUCCESS`;

export const FETCH_POSTS_LOAD = `${prefix}/FETCH_POSTS_LOAD`;
export const FETCH_POSTS_LOAD_SUCCESS = `${prefix}/FETCH_POSTS_LOAD_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    beginTime: null,
    endTime:   null,
    days:      [],
    orders:    [],
    stations:  [],
    postsLoad: {
        beginDate:       '', // 'YYYY-MM-DD'
        bussinessId:     null, // 0
        countOrders:     null, // 0
        dayName:         '', // monday
        loadCoefficient: null, // 0
        totalDuration:   '', // 00:00:00
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_DASHBOARD_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case FETCH_POSTS_LOAD_SUCCESS:
            return {
                ...state,
                postsLoad: payload,
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

export const fetchDashboard = () => ({
    type: FETCH_DASHBOARD_SUCCESS,
});

export const fetchDashboardSuccess = dashboard => ({
    type:    FETCH_DASHBOARD_SUCCESS,
    payload: dashboard,
});

export const fetchPostsLoad = () => ({
    type: FETCH_POSTS_LOAD_SUCCESS,
});

export const fetchPostsLoadSuccess = postsLoad => ({
    type:    FETCH_POSTS_LOAD_SUCCESS,
    payload: postsLoad,
});
