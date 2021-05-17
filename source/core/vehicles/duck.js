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
    client: {},
    generalData: {}
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_VEHICLE_SUCCESS:
            const {vehicle, client, generalData} = payload;
            return { 
                ...state, 
                vehicle: vehicle,
                client: client,
                generalData: generalData
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
export const selectClient = state => state[ moduleName ].client;
export const selectGeneralData = state => state[ moduleName ].generalData;


/**
 * Action Creators
 **/

export const fetchVehicle = ({vehicleId}) => ({
    type: FETCH_VEHICLE,
    payload: {vehicleId}
});

export const fetchVehicleSuccess = ({vehicle, client, generalData}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: {vehicle, client, generalData},
});
