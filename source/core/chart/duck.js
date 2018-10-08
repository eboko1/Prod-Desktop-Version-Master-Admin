// vendor
import { createSelector } from 'reselect';
import moment from 'moment';

// own
// import { chartPeriod }

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

export const selectChartDaterange = createSelector(
    [ stateSelector ],
    ({ filter: { date, period } }) => {
        const formatDate = (date, range, period) =>
            moment(date)
                .add(range, period)
                .format('YYYY-MM-DD');
        console.log('REDUX date', date);
        const daterange = {
            month: date => ({
                startDate: formatDate(date, -13, 'M'),
                endDate:   formatDate(date, 1, 'M'),
            }),
            week: date => ({
                startDate: formatDate(date, -84, 'd'),
                endDate:   formatDate(date, 14, 'd'),
                // startDate: formatDate(date, -12, 'w'),
                // endDate:   formatDate(date, 2, 'w'),
            }),
            day: date => ({
                startDate: formatDate(date, -7, 'd'),
                endDate:   formatDate(date, 7, 'd'),
            }),
        };

        const { startDate, endDate } = daterange[ period ](date || new Date());

        return {
            startDate,
            endDate,
        };
    },
);
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
