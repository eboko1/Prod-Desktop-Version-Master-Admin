/**
 * Constants
 **/

export const moduleName = 'vehicles';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    vehicle: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_VEHICLE_SUCCESS:
            const {vehicle} = payload;
            return { 
                ...state, 
                vehicle: vehicle 
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];
export const selectVehicle = state => state[ moduleName ].vehicle;

/**
 * Action Creators
 **/

export const fetchVehicle = () => ({
    type: FETCH_VEHICLE,
    // payload: {vehicleId}
});

export const fetchVehicleSuccess = ({vehicle}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: {vehicle},
});
