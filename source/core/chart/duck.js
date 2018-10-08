// vendor
import moment from 'moment';

/**
 * Constants
 * */
export const moduleName = 'chart';
const prefix = `cpb/${moduleName}`;

export const FETCH_CHART = `${prefix}/FETCH_CHART`;
export const FETCH_CHART_SUCCESS = `${prefix}/FETCH_CHART_SUCCESS`;

export const SET_CHART_DATE = `${prefix}/SET_CHART_DATE`;
export const SET_CHART_PERIOD = `${prefix}/SET_CHART_PERIOD`;
export const SET_CHART_MODE = `${prefix}/SET_CHART_MODE`;

/**
 * Reducer
 * */

const ReducerState = {
    chartData: [],
    filter:    {
        period: 'month',
        date:   moment(),
        // startDate: moment().format('YYYY-MM-DD'),
        mode:   'SALES',
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CHART_SUCCESS:
            return {
                ...state,
                chartData: payload,
            };

        case SET_CHART_PERIOD:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    period: payload,
                },
            };

        case SET_CHART_DATE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    date: payload,
                },
            };

        case SET_CHART_MODE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    mode: payload,
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
export const selectChartFilter = state => state.chart.filter;

/**
 * Actions
 * */

export const fetchChart = filter => ({
    type:    FETCH_CHART,
    payload: filter,
});

export const setChartDate = date => ({
    type:    SET_CHART_DATE,
    payload: date,
});

export const setChartPeriod = period => ({
    type:    SET_CHART_PERIOD,
    payload: period,
});

export const setChartMode = mode => ({
    type:    SET_CHART_MODE,
    payload: mode,
});

export const fetchChartSuccess = data => ({
    type:    FETCH_CHART_SUCCESS,
    payload: data,
});
