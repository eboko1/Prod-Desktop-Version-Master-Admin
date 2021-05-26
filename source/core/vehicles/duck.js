/** Constants **/

export const moduleName = 'vehicles';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLES = `${prefix}/FETCH_VEHICLES`;
export const FETCH_VEHICLES_SUCCESS = `${prefix}/FETCH_VEHICLES_SUCCESS`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

export const FETCH_VEHICLE_ORDERS = `${prefix}/FETCH_VEHICLE_ORDERS`;
export const FETCH_VEHICLE_ORDERS_SUCCESS = `${prefix}/FETCH_VEHICLE_ORDERS_SUCCESS`;

export const FETCH_VEHICLE_NORM_HOURS = `${prefix}/FETCH_VEHICLE_NORM_HOURS`;
export const FETCH_VEHICLE_NORM_HOURS_SUCCESS = `${prefix}/FETCH_VEHICLE_NORM_HOURS_SUCCESS`;

export const FETCH_VEHICLE_LABORS = `${prefix}/FETCH_VEHICLE_LABORS`;
export const FETCH_VEHICLE_LABORS_SUCCESS = `${prefix}/FETCH_VEHICLE_LABORS_SUCCESS`;

export const FETCH_VEHICLE_APPURTENANCES = `${prefix}/FETCH_VEHICLE_APPURTENANCES`;
export const FETCH_VEHICLE_APPURTENANCES_SUCCESS = `${prefix}/FETCH_VEHICLE_APPURTENANCES_SUCCESS`;

export const FETCH_VEHICLE_RECOMMENDATIONS = `${prefix}/FETCH_VEHICLE_RECOMMENDATIONS`;
export const FETCH_VEHICLE_RECOMMENDATIONS_SUCCESS = `${prefix}/FETCH_VEHICLE_RECOMMENDATIONS_SUCCESS`;

export const CREATE_ORDER = `${prefix}/CREATE_ORDER`;

export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;
export const SET_EXPANDED_VEHICLE_ID = `${prefix}/SET_EXPANDED_VEHICLE_ID`;
export const SET_PAGE_NORM_HOURS = `${prefix}/SET_PAGE_NORM_HOURS`;

/** Reducer **/

const ReducerState = {
    vehicles:      [],      // All vehicles, array of the can be used in a table
    stats:         {},      // Vehicles stats
    vehicle:       {},      // One vehicle can be used on its page
    client:        {},      // Vehicle client
    generalData:   {},      // Statisctics for fetched vehcile

    vehicleOrdersData: {
        orders: [], //Array of orders fetched for specific vehicle
        stats: {},
    },

    vehicleNormHoursData: {
        normHours: [], // Array of norm hours standard data
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined
        }
        // here filters sorts, etc..
    },

    vehicleLaborsData: { 
        labors: [], //Array of labors made for vehicle in different orders
        stats: {},
    },

    vehicleAppurtenancesData: { 
        appurtenances: [], //Array of appurtenances made for vehicle in different orders
        stats: {},
    },

    vehicleRecommendationsData: { 
        recommendations: [], //Array of recommendations made for vehicle in different orders
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

        case SET_PAGE_NORM_HOURS:
            const { page: pageNormHours } = payload;
            return {
                ...state,
                sort: {
                    ...state.sort,
                    page: pageNormHours
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

        case FETCH_VEHICLE_NORM_HOURS_SUCCESS:
            const {normHours, stats: vehicleNormHoursStats} = payload;
            return {
                ...state,
                vehicleNormHoursData: {
                    ...state.vehicleNormHoursData,
                    normHours: normHours,
                    stats: vehicleNormHoursStats
                }
            };

        case FETCH_VEHICLE_LABORS_SUCCESS:
            const {labors, stats: vehicleLaborsStats} = payload;
            return {
                ...state,
                vehicleLaborsData: {
                    ...state.vehicleLaborsData,
                    labors: labors,
                    stats: vehicleLaborsStats
                }
            };

        case FETCH_VEHICLE_APPURTENANCES_SUCCESS:
            const {appurtenances, stats: vehicleAppurtenancesStats} = payload;
            return {
                ...state,
                vehicleAppurtenancesData: {
                    ...state.vehicleAppurtenancesData,
                    appurtenances: appurtenances,
                    stats: vehicleAppurtenancesStats
                }
            };

        case FETCH_VEHICLE_RECOMMENDATIONS_SUCCESS:
            const {recommendations, stats: vehicleRecommendationsStats} = payload;
            return {
                ...state,
                vehicleRecommendationsData: {
                    ...state.vehicleRecommendationsData,
                    recommendations: recommendations,
                    stats: vehicleRecommendationsStats
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
export const selectVehicleLabors = state => state[ moduleName ].vehicleLaborsData.labors;
export const selectVehicleLaborsStats = state => state[ moduleName ].vehicleLaborsData.stats;
export const selectVehicleNormHours = state => state[ moduleName ].vehicleNormHoursData.normHours;
export const selectVehicleNormHoursStats = state => state[ moduleName ].vehicleNormHoursData.stats;
export const selectVehicleNormHoursSort = state => state[ moduleName ].sort;
export const selectVehicleNormHoursFilters = state => state[ moduleName ].filters;

export const selectVehicleAppurtenances = state => state[ moduleName ].vehicleAppurtenancesData.appurtenances;
export const selectVehicleAppurtenancesStats = state => state[ moduleName ].vehicleAppurtenancesData.stats;
export const selectVehicleRecommendations = state => state[ moduleName ].vehicleRecommendationsData.recommendations;
export const selectVehicleRecommendationsStats = state => state[ moduleName ].vehicleRecommendationsData.stats;


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
 * Vehicle is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
 export const fetchVehicleOrders = () => ({
    type:    FETCH_VEHICLE_ORDERS
});

export const fetchVehicleOrdersSuccess = ({orders, stats}) => ({
    type:    FETCH_VEHICLE_ORDERS_SUCCESS,
    payload: {orders, stats},
});

/**
 * Fetches vehicle labors which were made in different orders
 * Vehicle is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
 export const fetchVehicleLabors = () => ({
    type:    FETCH_VEHICLE_LABORS
});

export const fetchVehicleLaborsSuccess = ({labors, stats}) => ({
    type:    FETCH_VEHICLE_LABORS_SUCCESS,
    payload: {labors, stats},
});

/**
 * Fetches vehicle norm hours
 * Vehicle is taken from "expandedVehicleId"
 * @returns {*} params.vehicleId Vehicle to fetch data for
 */
export const fetchVehicleNormHours = () => ({
    type:    FETCH_VEHICLE_NORM_HOURS
});

export const fetchVehicleNormHoursSuccess = ({normHours, stats}) => ({
    type:    FETCH_VEHICLE_NORM_HOURS_SUCCESS,
    payload: {normHours, stats},
});

/**
 * Fetches vehicle appurtenances which were used in different orders
 * Vehicle is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
 export const fetchVehicleAppurtenances = () => ({
    type:    FETCH_VEHICLE_APPURTENANCES
});

export const fetchVehicleAppurtenancesSuccess = ({appurtenances, stats}) => ({
    type:    FETCH_VEHICLE_APPURTENANCES_SUCCESS,
    payload: {appurtenances, stats},
});
/**
 * Fetches vehicle recommendations which were used in different orders
 * Vehicle is taken from "expandedVehicleId"
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
 export const fetchVehicleRecommendations = () => ({
    type:    FETCH_VEHICLE_RECOMMENDATIONS
});

export const fetchVehicleRecommendationsSuccess = ({recommendations, stats}) => ({
    type:    FETCH_VEHICLE_RECOMMENDATIONS_SUCCESS,
    payload: {recommendations, stats},
});

/**
 * Create new order(н/з) which will contain specific client and its vehicle.
 * New client will be fetched by its id.
 * @param {*} params.clientId - id of a client
 * @param {*} params.managerId - id of a manager who created an order(current user)
 */
 export const createOrder = ({clientId, managerId, vehicleId}) => ({
    type: CREATE_ORDER,
    payload: {clientId, managerId, vehicleId}
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

/** Set filtering page, automatically fetches vehicle norm hours */
export const setPageNormHours = ({page}) => {
    // console.log("In action: ", page)
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_NORM_HOURS,
            payload: {page}
        });
        return dispatch(fetchVehicleNormHours());
    }
};

/** Set filtering query for vehicles, automatically fetches vehicles */
export const setSearchQuery = ({query}) => {
    return (dispatch) => {
        dispatch({
            type: SET_SEARCH_QUERY,
            payload: {query}
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