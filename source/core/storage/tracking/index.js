/**
 * Constants
 **/
export const moduleName = 'tracking';
const prefix = `cbp/${moduleName}`;

export const FETCH_TRACKING = `${prefix}/FETCH_TRACKING`;
export const FETCH_TRACKING_SUCCESS = `${prefix}/FETCH_TRACKING_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    trackingData: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_TRACKING_SUCCESS:
            return { ...state, tracking: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreTracking = state =>
    stateSelector(state).trackingData;

/**
 * Action Creators
 **/

export const fetchTracking = () => ({
    type: FETCH_TRACKING,
});

export const fetchTrackingSuccess = tracking => ({
    type:    FETCH_TRACKING_SUCCESS,
    payload: tracking,
});
