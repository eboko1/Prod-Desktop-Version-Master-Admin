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

export const FETCH_RECORDING_LINK = `${prefix}/FETCH_RECORDING_LINK`;
export const FETCH_RECORDING_LINK_SUCCESS = `${prefix}/FETCH_RECORDING_LINK_SUCCESS`;

export const SET_CALLS_TAB = `${prefix}/SET_CALLS_TAB`;
export const SET_CALLS_DATERANGE = `${prefix}/SET_CALLS_DATERANGE`;
export const SET_CALLS_PERIOD = `${prefix}/SET_CALLS_PERIOD`;
export const SET_CALLS_CHANNEL_ID = `${prefix}/SET_CALLS_CHANNEL_ID`;
export const SET_CALLS_CHART_MODE = `${prefix}/SET_CALLS_CHART_MODE`;
export const SET_CALLS_TABLE_MODE = `${prefix}/SET_CALLS_TABLE_MODE`;
export const SET_CALLS_PAGE_FILTER = `${prefix}/SET_CALLS_PAGE_FILTER`;

/**
 * Reducer
 * */

const ReducerState = {
    tab:             'callsChart',
    channels:        [],
    calls:           [],
    stats:           {},
    chart:           [],
    callsLinksCache: {}, //Contains key-value pairs which represents callId - recording link, it is required because Binotel does not provide long term links
    filter:     {
        channelId: null,
        startDate: moment()
            .subtract(3, 'months')
            .format('YYYY-MM-DD'),
        endDate:    moment().format('YYYY-MM-DD'),
        period:     'month',
        mode:       'answered',
        page:       1,
        chartModes: {},
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

        case FETCH_RECORDING_LINK_SUCCESS:
            const {callId, recordingLink} = payload;
            return {
                ...state,
                callsLinksCache: {
                    ...state.callsLinksCache,
                    [callId]: recordingLink
                }
            };

        case SET_CALLS_TAB:
            return {
                ...state,
                tab: payload,
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

        case SET_CALLS_CHANNEL_ID:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    channelId: payload,
                },
            };

        case SET_CALLS_CHART_MODE:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    chartModes: payload,
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
export const selectCallsFilter = state => state[ moduleName ].filter;
export const selectCallsStats = state => state[ moduleName ].stats;
export const selectCallsLinksCache = state => state[ moduleName ].callsLinksCache;

export const selectCallsData = createSelector([ stateSelector ], ({ calls }) =>
    calls.map(call => ({
        ...call,
        ...{ duration: call.duration - call.waiting },
    })));

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

export const fetchCallsChart = init => ({
    type:    FETCH_CALLS_CHART,
    payload: init,
});

export const fetchCallsChartSuccess = data => ({
    type:    FETCH_CALLS_CHART_SUCCESS,
    payload: data,
});

export const fetchRecordingLink = ({callId}) => ({
    type: FETCH_RECORDING_LINK,
    payload: {callId}
});

export const fetchRecordingLinkSuccess = ({callId, recordingLink}) => ({
    type: FETCH_RECORDING_LINK_SUCCESS,
    payload: {callId, recordingLink}
});

export const setCallsTab = tab => ({
    type:    SET_CALLS_TAB,
    payload: tab,
});

export const setCallsDaterange = daterange => ({
    type:    SET_CALLS_DATERANGE,
    payload: daterange,
});

export const setCallsPeriod = period => ({
    type:    SET_CALLS_PERIOD,
    payload: period,
});

export const setCallsChannelId = channelId => ({
    type:    SET_CALLS_CHANNEL_ID,
    payload: channelId,
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
