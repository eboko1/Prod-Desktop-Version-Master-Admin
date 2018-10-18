// vendor
import moment from 'moment';
import { createSelector } from 'reselect';
import _ from 'lodash';

// own
// import { config } from './config.js';

/**
 * Constants
 * */
export const moduleName = 'calls';
const prefix = `cpb/${moduleName}`;

export const FETCH_CALLS = `${prefix}/FETCH_CALLS`;
export const FETCH_CALLS_SUCCESS = `${prefix}/FETCH_CALLS_SUCCESS`;

export const FETCH_CALLS_CHART = `${prefix}/FETCH_CALLS_CHART`;
export const FETCH_CALLS_CHART_SUCCESS = `${prefix}/FETCH_CALLS_CHART_SUCCESS`;

export const SET_CALLS_DATERANGE = `${prefix}/SET_CALLS_DATERANGE`;
export const SET_CALLS_PERIOD = `${prefix}/SET_CALLS_PERIOD`;
export const SET_CALLS_CHART_MODE = `${prefix}/SET_CALLS_CHART_MODE`;
export const SET_CALLS_TABLE_MODE = `${prefix}/SET_CALLS_TABLE_MODE`;
export const SET_CALLS_PAGE_FILTER = `${prefix}/SET_CALLS_PAGE_FILTER`;

/**
 * Reducer
 * */

const ReducerState = {
    channels: [],
    calls:    [],
    stats:    {},
    chart:    [],
    filter:   {
        startDate: moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        period:  'month',
        mode:    'answered',
        page:    1,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CALLS_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case FETCH_CALLS_CHART_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case SET_CALLS_DATERANGE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    startDate: payload[ 0 ].format('YYYY-MM-DD'),
                    endDate:   payload[ 1 ].format('YYYY-MM-DD'),
                    page:      1,
                },
            };

        case SET_CALLS_PERIOD:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    period: payload,
                },
            };

        case SET_CALLS_CHART_MODE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    statusIn: [ ...payload ],
                },
            };

        case SET_CALLS_TABLE_MODE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    mode: payload,
                    page: 1,
                },
            };

        case SET_CALLS_PAGE_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    page: payload,
                },
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectCallsFilter = state => state.calls.filter;

export const selectCallsChartData = createSelector(
    [ stateSelector ],
    ({ chart }) => chart.map(item => ({ id: item.id, ...item.score })),
);

export const selectCallsPieData = createSelector(
    [ stateSelector ],
    ({ stats }) => {
        const data = _.pick(stats, [ 'answered', 'notAnswered', 'busy' ]);

        return Object.entries(data).map(([ key, value ]) => ({
            x: key,
            y: value,
        }));
    },
);

/**
 * Actions
 * */

export const fetchCalls = () => ({
    type: FETCH_CALLS,
});

export const fetchCallsSuccess = data => ({
    type:    FETCH_CALLS_SUCCESS,
    payload: data,
});

export const fetchCallsChart = () => ({
    type: FETCH_CALLS_CHART,
});

export const fetchCallsChartSuccess = data => ({
    type:    FETCH_CALLS_CHART_SUCCESS,
    payload: data,
});

export const setCallsDaterange = daterange => ({
    type:    SET_CALLS_DATERANGE,
    payload: daterange,
});

export const setCallsPeriod = period => ({
    type:    SET_CALLS_PERIOD,
    payload: period,
});

export const setCallsChartMode = mode => ({
    type:    SET_CALLS_CHART_MODE,
    payload: mode,
});

export const setCallsTableMode = mode => ({
    type:    SET_CALLS_TABLE_MODE,
    payload: mode,
});

export const setCallsPageFilter = page => ({
    type:    SET_CALLS_PAGE_FILTER,
    payload: page,
});
