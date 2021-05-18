/**
 * Constants
 **/

export const moduleName = 'vehicles';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLES = `${prefix}/FETCH_VEHICLES`;
export const FETCH_VEHICLES_SUCCESS = `${prefix}/FETCH_VEHICLES_SUCCESS`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    vehicles: [],   //All vehicles, array of the can be used in a table
    stats: {},      // Vehicles stats
    vehicle: {},    //One vehicle can be used on its page
    client: {},     //Vehicle client
    generalData: {} //Statisctics for fetched vehcile
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
        case FETCH_VEHICLES_SUCCESS:
            const {vehicles, stats} = payload;
            return { 
                ...state, 
                vehicles: vehicles,
                stst: stats
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
export const selectVehicles = state => state[ moduleName ].vehicles;
export const selectVehiclesStats = state => state[ moduleName ].stats;
export const selectClient = state => state[ moduleName ].client;
export const selectGeneralData = state => state[ moduleName ].generalData;


/** Action Creators **/

/**
 * Fetch all vehicles
 */
export const fetchVehicles = () => ({
    type: FETCH_VEHICLES,
});

export const fetchVehiclesSuccess = ({vehicles, stats}) => ({
    type:    FETCH_VEHICLES_SUCCESS,
    payload: {vehicles, stats},
});

/**
 * Fetches data about one vehicle
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
export const fetchVehicle = ({vehicleId}) => ({
    type: FETCH_VEHICLE,
    payload: {vehicleId}
});

export const fetchVehicleSuccess = ({vehicle, client, generalData}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: {vehicle, client, generalData},
});
