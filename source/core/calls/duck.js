// vendor
import moment from 'moment';
import { createSelector } from 'reselect';
import _ from 'lodash';

/**
 * Constants
 * */
export const moduleName = 'calls';
const prefix = `cpb/${moduleName}`;

export const FETCH_CALLS = `${prefix}/FETCH_CALLS`;
export const FETCH_CALLS_SUCCESS = `${prefix}/FETCH_CALLS_SUCCESS`;

export const FETCH_CALLS_CHART = `${prefix}/FETCH_CALLS_CHART`;
export const FETCH_CALLS_CHART_SUCCESS = `${prefix}/FETCH_CALLS_CHART_SUCCESS`;

export const FETCH_CALLS_DATERANGE = `${prefix}/FETCH_CALLS_DATERANGE`;
// export const FETCH_CALLS_DATERANGE_SUCCESS = `${prefix}/FETCH_CALLS_DATERANGE_SUCCESS`;

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

        case FETCH_CALLS_DATERANGE:
            return {
                ...state,
                filter: {
                    ...payload,
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

export const fetchCallsDaterange = daterange => ({
    type:    FETCH_CALLS_DATERANGE,
    payload: daterange,
});
