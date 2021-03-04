/**
 * Constants
 **/

export const moduleName = 'vehicleTypes';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE_TYPES = `${prefix}/FETCH_VEHICLE_TYPES`;
export const FETCH_VEHICLE_TYPES_SUCCESS = `${prefix}/FETCH_VEHICLE_TYPES_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    vehicleTypes: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_VEHICLE_TYPES_SUCCESS:
            return { 
                ...state, 
                vehicleTypes: payload 
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];
export const selectVehicleTypes = state => state[ moduleName ].vehicleTypes;

/**
 * Action Creators
 **/

export const fetchVehicleTypes = () => ({
    type: FETCH_VEHICLE_TYPES,
});

export const fetchVehicleTypesSuccess = vehicleTypes => ({
    type:    FETCH_VEHICLE_TYPES_SUCCESS,
    payload: vehicleTypes,
});
