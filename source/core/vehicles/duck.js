/** Constants **/

export const moduleName = 'vehicles';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLES = `${prefix}/FETCH_VEHICLES`;
export const FETCH_VEHICLES_SUCCESS = `${prefix}/FETCH_VEHICLES_SUCCESS`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

export const FETCH_VEHICLE_ORDERS = `${prefix}/FETCH_VEHICLE_ORDERS`;
export const FETCH_VEHICLE_ORDERS_SUCCESS = `${prefix}/FETCH_VEHICLE_ORDERS_SUCCESS`;

export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;
export const SET_EXPANDED_VEHICLE_ID = `${prefix}/SET_EXPANDED_VEHICLE_ID`;

/** Reducer **/

const ReducerState = {
    vehicles:      [],      // All vehicles, array of the can be used in a table
    stats:         {},      // Vehicles stats
    vehicle:       {},      // One vehicle can be used on its page
    client:        {},      // Vehicle client
    generalData:   {},      // Statisctics for fetched vehcile

    vehicleOrdersData: { //Array of orders fetch for specific vehicle
        orders: [],
        stats: {},
    },
    expandedVehicleId: undefined, //Currently selected vehicle row

    filters: {
        query: undefined,
    },
    sort: {
        page: 1
    }
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
                stats: stats
            };

        case SET_PAGE:
            const { page } = payload;
            return {
                ...state,
                sort: {
                    ...state.sort,
                    page: page
                }
            };
            
        case SET_SEARCH_QUERY:
            const { query } = payload;
            return {
                ...state,
                filters: {
                    ...state.filters,
                    query: query
                }
            };
        
        case SET_EXPANDED_VEHICLE_ID:
            const { vehicleId } = payload;
            return {
                ...state,
                expandedVehicleId: vehicleId
            };

        case FETCH_VEHICLE_ORDERS_SUCCESS:
            const {orders, stats: vehicleOrdersStats} = payload;
            return {
                ...state,
                vehicleOrdersData: {
                    ...state.vehicleOrdersData,
                    orders: orders,
                    stats: vehicleOrdersStats
                }
            };
        default:
            return state;
    }
}

/** Selectors **/

export const stateSelector = state => state[ moduleName ];
export const selectVehicle = state => state[ moduleName ].vehicle;
export const selectVehicles = state => state[ moduleName ].vehicles;
export const selectVehiclesStats = state => state[ moduleName ].stats;
export const selectClient = state => state[ moduleName ].client;
export const selectGeneralData = state => state[ moduleName ].generalData;
export const selectSort = state => state[ moduleName ].sort;
export const selectFilters = state => state[ moduleName ].filters;
export const selectExpandedVehicleId = state => state[ moduleName ].expandedVehicleId;
export const selectVehicleOrders = state => state[ moduleName ].vehicleOrdersData.orders;
export const selectVehicleOrdersStats = state => state[ moduleName ].vehicleOrdersData.stats;




/** Action Creators **/

/** Fetch all vehicles */
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
    type:    FETCH_VEHICLE,
    payload: {vehicleId}
});

export const fetchVehicleSuccess = ({vehicle, client, generalData}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: {vehicle, client, generalData},
});

/**
 * Fetches orders where vehicle was participating.
 * Vehicle is is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
 export const fetchVehicleOrders = () => ({
    type:    FETCH_VEHICLE_ORDERS
});

export const fetchVehicleOrdersSuccess = ({orders, stats}) => ({
    type:    FETCH_VEHICLE_ORDERS_SUCCESS,
    payload: {orders, stats},
});

/** Set filtering page, automatically fetches vehicles */
export const setPage = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE,
            payload: {page}
        });
        return dispatch(fetchVehicles());
    }
};

/** Set filtering query for vehicles, automatically fetches vehicles */
export const setSearchQuery = ({rowId}) => {
    return (dispatch) => {
        dispatch({
            type: SET_SEARCH_QUERY,
            payload: {rowId}
        });
        return dispatch(fetchVehicles());
    }
};

/** Set expanded vehicle id to load data for it(all the orders for that vehicle), automatically fetches orders. Use this to load data for any car by its is. */
export const setExpandedVehicleId = ({vehicleId}) => {
    return (dispatch) => {
        dispatch({
            type: SET_EXPANDED_VEHICLE_ID,
            payload: {vehicleId}
        });

        vehicleId && (vehicleId != "") && dispatch(fetchVehicleOrders()); //Fetch only if Id is valid
    }
};