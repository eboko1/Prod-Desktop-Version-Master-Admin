/**
 * Constants
 * */
export const moduleName = 'vehicleNumberHistory';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE_NUMBER_HISTORY = `${prefix}/FETCH_VEHICLE_NUMBER_HISTORY`;
export const FETCH_VEHICLE_NUMBER_HISTORY_SUCCESS = `${prefix}/FETCH_VEHICLE_NUMBER_HISTORY_SUCCESS`;

export const CLEAR_FETCH_VEHICLE_NUMBER_HISTORY = `${prefix}/CLEAR_FETCH_VEHICLE_NUMBER_HISTORY`;

/**
 * Reducer
 * */

const ReducerState = {
    history: null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_VEHICLE_NUMBER_HISTORY_SUCCESS:
            return {
                ...state,
                history: payload,
            };

        case CLEAR_FETCH_VEHICLE_NUMBER_HISTORY:
            return {
                ...state,
                history: null,
            };

        default:
            return state;
    }
}

export const fetchVehicleNumberHistory = number => ({
    type:    FETCH_VEHICLE_NUMBER_HISTORY,
    payload: number,
});

export const fetchVehicleNumberHistorySuccess = history => ({
    type:    FETCH_VEHICLE_NUMBER_HISTORY_SUCCESS,
    payload: history,
});

export const clearVehicleNumberHistory = () => ({
    type: CLEAR_FETCH_VEHICLE_NUMBER_HISTORY,
});
