/**
 * Constants
 * */
export const moduleName = 'chart';
const prefix = `cpb/${moduleName}`;

export const FETCH_CHART = `${prefix}/FETCH_CHART`;
export const FETCH_CHART_SUCCESS = `${prefix}/FETCH_CHART_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    chart:  {},
    filter: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CHART_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
}

/**
 * Actions
 * */

export const fetchChart = filter => ({
    type:    FETCH_CHART,
    payload: filter,
});

export const fetchChartSuccess = data => ({
    type:    FETCH_CHART_SUCCESS,
    payload: data,
});
