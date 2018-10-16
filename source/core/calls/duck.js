// vendor
import moment from 'moment';

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
    // calls: [
    //     {
    //         businessId:     1174,
    //         caller:         380506541955,
    //         channelId:      3,
    //         date:           '2018-08-14 12:20:24',
    //         duration:       102,
    //         id:             49928,
    //         innerRecipient: null,
    //         ocr_ctl_id_fk:  49928,
    //         orders:         [{ order: 99659, status: 'success' }],
    //         recipient:      380953315145,
    //         recordingLink:  null,
    //         redundant:      'f',
    //         status:         'PROPER',
    //         tasks:          null,
    //         tcr_ctl_id_fk:  null,
    //         type:           'in',
    //         waiting:        3,
    //     },
    //     {
    //         businessId:     1174,
    //         caller:         380506541955,
    //         channelId:      3,
    //         date:           '2018-08-14 12:19:41',
    //         duration:       6,
    //         id:             49927,
    //         innerRecipient: null,
    //         ocr_ctl_id_fk:  49927,
    //         orders:         [{ order: 99658, status: 'cancel' }],
    //         recipient:      380953315145,
    //         recordingLink:  null,
    //         redundant:      'f',
    //         status:         'NO ANSWER',
    //         tasks:          null,
    //         tcr_ctl_id_fk:  null,
    //         type:           'in',
    //         waiting:        0,
    //     },
    // ],
    channels: [],
    calls:    [],
    stats:    [],
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
