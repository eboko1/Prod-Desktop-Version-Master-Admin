/** Constants **/

export const moduleName = 'vehicles';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLES = `${prefix}/FETCH_VEHICLES`;
export const FETCH_VEHICLES_SUCCESS = `${prefix}/FETCH_VEHICLES_SUCCESS`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

export const FETCH_VEHICLE_ATTRIBUTES = `${prefix}/FETCH_VEHICLE_ATTRIBUTES`;
export const FETCH_VEHICLE_ATTRIBUTES_SUCCESS = `${prefix}/FETCH_VEHICLE_ATTRIBUTES_SUCCESS`;

export const FETCH_VEHICLE_ORDERS_LATEST = `${prefix}/FETCH_VEHICLE_ORDERS_LATEST`;
export const FETCH_VEHICLE_ORDERS_LATEST_SUCCESS = `${prefix}/FETCH_VEHICLE_ORDERS_LATEST_SUCCESS`;

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
export const DELETE_VEHICLE = `${prefix}/DELETE_VEHICLE`;

export const SET_FETCHING_VEHICLE = `${prefix}/SET_FETCHING_VEHICLE`;
export const SET_FETCHING_VEHICLE_ORDERS = `${prefix}/SET_FETCHING_VEHICLE_ORDERS`;
export const SET_FETCHING_VEHICLES = `${prefix}/SET_FETCHING_VEHICLES`;
export const SET_FETCHING_VEHICLE_ATTRIBUTES = `${prefix}/SET_FETCHING_VEHICLE_ATTRIBUTES`;
export const SET_FETCHING_VEHICLE_CLIENT = `${prefix}/SET_FETCHING_VEHICLE_CLIENT`;
export const SET_FETCHING_ORDERS_LATEST = `${prefix}/SET_FETCHING_ORDERS_LATEST`;
export const SET_FETCHING_ORDERS = `${prefix}/SET_FETCHING_ORDERS`;
export const SET_FETCHING_NORM_HOURS = `${prefix}/SET_FETCHING_NORM_HOURS`;
export const SET_FETCHING_LABORS = `${prefix}/SET_FETCHING_LABORS`;
export const SET_FETCHING_APPURTENANCES = `${prefix}/SET_FETCHING_APPURTENANCES`;
export const SET_FETCHING_RECOMMENDATION = `${prefix}/SET_FETCHING_RECOMMENDATION`;

/*--------------Pages----------------------*/
export const SET_PAGE = `${prefix}/SET_PAGE`;
export const SET_PAGE_ORDERS = `${prefix}/SET_PAGE_ORDERS`;
export const SET_PAGE_NORM_HOURS = `${prefix}/SET_PAGE_NORM_HOURS`;
export const SET_PAGE_LABORS = `${prefix}/SET_PAGE_LABORS`;
export const SET_PAGE_APPURTENANCES = `${prefix}/SET_PAGE_APPURTENANCES`;
export const SET_PAGE_RECOMMENDATIONS = `${prefix}/SET_PAGE_RECOMMENDATIONS`;

/*------------Search fields-------------------------------------------*/
export const SET_SEARCH_QUERY = `${prefix}/SET_SEARCH_QUERY`;
export const SET_NORM_HOURS_SEARCH_QUERY = `${prefix}/SET_NORM_HOURS_SEARCH_QUERY`;

export const SET_EXPANDED_VEHICLE_ID = `${prefix}/SET_EXPANDED_VEHICLE_ID`;


/** Reducer **/

const ReducerState = {
    vehicles:      [],      // All vehicles, array of the can be used in a table
    stats:         {},      // Vehicles stats
    vehicle:       {},      // One vehicle can be used on its page
    client:        {},      // Vehicle client
    generalData:   {},      // Statistics for fetched vehicle
    vehicleAttributes: {},  // Vehicle attributes

    fetchingVehicle: false,
    fetchingVehicleOrders: false,
    fetchingVehicles: false,
    fetchingVehicleAttributes: false,
    fetchingVehicleClient: false,
    fetchingOrdersLatest: false,

    vehicleOrdersData: {
        orders: [], //Array of orders fetched for specific vehicle
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined
        }
    },

    vehicleNormHoursData: {
        normHours: [], // Array of norm hours standard data
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined
        },
        fetching: false,
    },

    vehicleLaborsData: { 
        labors: [], //Array of labors made for vehicle in different orders
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined
        },
        fetching: false,
    },

    vehicleAppurtenancesData: { 
        appurtenances: [], //Array of appurtenances made for vehicle in different orders
        stats: {},
        sort: {
            page: 1
        },
        filters: {
            query: undefined,
        },
        fetching: false,
    },

    vehicleRecommendationsData: { 
        recommendations: [], //Array of recommendations made for vehicle in different orders
        stats: {},
        query: { // Query params
            page: 1
        },
        fetching: false,
    },

    expandedVehicleId: undefined, //Currently selected vehicle

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
            const {vehicle, client} = payload;
            return { 
                ...state, 
                vehicle: vehicle ? vehicle : state.vehicle,
                client: client ? client : state.client,
            };

        case FETCH_VEHICLE_ORDERS_LATEST_SUCCESS:
            const { generalData } = payload;
            return {
                ...state,
                generalData: generalData
            };
        case FETCH_VEHICLE_ATTRIBUTES_SUCCESS:
            const { vehicleAttributes } = payload;
            return {
                ...state,
                vehicleAttributes: vehicleAttributes
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

            /*---------Fetchers-----------------*/

        case SET_FETCHING_VEHICLE:
            return {
                ...state,
                fetchingVehicle: payload,
            };

        case SET_FETCHING_VEHICLE_ORDERS:
            return {
                ...state,
                fetchingVehicleOrders: payload,
            };

        case SET_FETCHING_VEHICLES:
            return {
                ...state,
                fetchingVehicles: payload,
            };

        case SET_FETCHING_VEHICLE_CLIENT:
            return {
                ...state,
                fetchingVehicleClient: payload
            };

        case SET_FETCHING_VEHICLE_ATTRIBUTES:
            return {
                ...state,
                fetchingVehicleAttributes: payload
            };

        case SET_FETCHING_ORDERS_LATEST:
            return {
                ...state,
                fetchingOrdersLatest: payload,
            };

        case SET_FETCHING_ORDERS:
            return {
                ...state,
                vehicleOrdersData: {
                    ...state.vehicleOrdersData,
                    fetching: payload
                }
            };
        case SET_FETCHING_NORM_HOURS:
            return {
                ...state,
                vehicleNormHoursData: {
                    ...state.vehicleNormHoursData,
                    fetching: payload
                }
            };
        case SET_FETCHING_LABORS:
            return {
                ...state,
                vehicleLaborsData: {
                    ...state.vehicleLaborsData,
                    fetching: payload
                }
            };
        case SET_FETCHING_APPURTENANCES:
            return {
                ...state,
                vehicleAppurtenancesData: {
                    ...state.vehicleAppurtenancesData,
                    fetching: payload
                }
            };
        case SET_FETCHING_RECOMMENDATION:
            return {
                ...state,
                vehicleRecommendationsData: {
                    ...state.vehicleRecommendationsData,
                    fetching: payload
                }
            };

        /*---------Fetchers end-----------------*/


        case SET_PAGE_ORDERS:
            const { page: pageOrders } = payload;

            return {
                ...state,
                vehicleOrdersData: {
                    ...state.vehicleOrdersData,
                    sort: {
                        ...state.vehicleOrdersData.sort,
                        page: pageOrders
                    }
                }
            }

        case SET_PAGE_NORM_HOURS:
            const { page: pageNormHours } = payload;
            return {
                ...state,
                vehicleNormHoursData: {
                    ...state.vehicleNormHoursData,
                    sort: {
                        ...state.vehicleNormHoursData.sort,
                        page: pageNormHours
                    }
                }
            };


        case SET_PAGE_LABORS:
            const { page: pageLabors } = payload;
            return {
                ...state,
                vehicleLaborsData: {
                    ...state.vehicleLaborsData,
                    sort: {
                        ...state.vehicleLaborsData.sort,
                        page: pageLabors
                    }
                }
            };

        case SET_PAGE_APPURTENANCES:
            const { page: pageAppurtenances } = payload;
            return {
                ...state,
                vehicleAppurtenancesData: {
                    ...state.vehicleAppurtenancesData,
                    sort: {
                        ...state.vehicleAppurtenancesData.sort,
                        page: pageAppurtenances
                    }
                }
            };

        case SET_PAGE_RECOMMENDATIONS:
            const { page: pageRecomendations } = payload;
            return {
                ...state,
                vehicleRecommendationsData: {
                    ...state.vehicleRecommendationsData,
                    query: {
                        ...state.vehicleRecommendationsData.query,
                        page: pageRecomendations
                    }
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
        case SET_NORM_HOURS_SEARCH_QUERY:
            const { query: queryNormHours } = payload;
            return {
                ...state,
                vehicleNormHoursData: {
                    ...state.vehicleNormHoursData,
                    filters: {
                        ...state.filters,
                        query: queryNormHours
                    }
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

/*-------------Fetchers------------------------*/
export const selectFetchingVehicle = state => state[ moduleName ].fetchingVehicle;
export const selectFetchingVehicles = state => state[ moduleName ].fetchingVehicles;
export const selectFetchingVehicleAttributes = state => state[ moduleName ].fetchingVehicleAttributes;
export const selectFetchingVehicleClient = state => state[ moduleName ].fetchingVehicleClient;
export const selectFetchingOrdersLatest = state => state[ moduleName ].fetchingOrdersLatest;
export const selectFetchingVehicleOrders = state => state[ moduleName ].fetchingVehicleOrders;

/** -------------Data---------------------------------------- */
export const selectVehicles = state => state[ moduleName ].vehicles;
export const selectVehicleAttributes = state => state[ moduleName ].vehicleAttributes
export const selectVehiclesStats = state => state[ moduleName ].stats;
export const selectClient = state => state[ moduleName ].client;
export const selectGeneralData = state => state[ moduleName ].generalData;
export const selectSort = state => state[ moduleName ].sort;
export const selectFilters = state => state[ moduleName ].filters;
export const selectExpandedVehicleId = state => state[ moduleName ].expandedVehicleId;

/*---------------------Orders-------------------------------------------*/
export const selectVehicleOrders = state => state[ moduleName ].vehicleOrdersData.orders;
export const selectVehicleOrdersStats = state => state[ moduleName ].vehicleOrdersData.stats;
export const selectVehicleOrdersSort = state => state[ moduleName ].vehicleOrdersData.sort;
export const selectVehicleOrdersFilters = state => state[ moduleName ].vehicleOrdersData.filters;
export const selectVehicleOrdersFetching = state => state[ moduleName ].vehicleOrdersData.fetching;

/*------------------Labors----------------------------------------*/
export const selectVehicleLabors = state => state[ moduleName ].vehicleLaborsData.labors;
export const selectVehicleLaborsStats = state => state[ moduleName ].vehicleLaborsData.stats;
export const selectVehicleLaborsSort = state => state[ moduleName ].vehicleLaborsData.sort;
export const selectVehicleLaborsFilters = state => state[ moduleName ].vehicleLaborsData.filters;
export const selectVehicleLaborsFetching = state => state[ moduleName ].vehicleLaborsData.fetching;

/*---------------------Norm hours-------------------------------------- */
export const selectVehicleNormHours = state => state[ moduleName ].vehicleNormHoursData.normHours;
export const selectVehicleNormHoursStats = state => state[ moduleName ].vehicleNormHoursData.stats;
export const selectVehicleNormHoursSort = state => state[ moduleName ].vehicleNormHoursData.sort;
export const selectVehicleNormHoursFilters = state => state[ moduleName ].vehicleNormHoursData.filters;
export const selectVehicleNormHoursFetching = state => state[ moduleName ].vehicleNormHoursData.fetching;

/*----------------------Appurtenances--------------------------------------------------*/
export const selectVehicleAppurtenances = state => state[ moduleName ].vehicleAppurtenancesData.appurtenances;
export const selectVehicleAppurtenancesStats = state => state[ moduleName ].vehicleAppurtenancesData.stats;
export const selectVehicleAppurtenancesSort = state => state[ moduleName ].vehicleAppurtenancesData.sort;
export const selectVehicleAppurtenancesFilters = state => state[ moduleName ].vehicleAppurtenancesData.filters;
export const selectVehicleAppurtenancesFetching = state => state[ moduleName ].vehicleAppurtenancesData.fetching;

/*------------------------Recommendations-----------------------------------------*/
export const selectVehicleRecommendations = state => state[ moduleName ].vehicleRecommendationsData.recommendations;
export const selectVehicleRecommendationsStats = state => state[ moduleName ].vehicleRecommendationsData.stats;
export const selectVehicleRecommendationsQuery = state => state[ moduleName ].vehicleRecommendationsData.query;
export const selectVehicleRecommendationsFetching = state => state[ moduleName ].vehicleRecommendationsData.fetching;


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

export const fetchVehicleSuccess = ({vehicle, client }) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: {vehicle, client },
});

/**
 * Fetches data about one vehicle
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
export const fetchVehicleAttributes = ({vehicleId}) => ({
    type:    FETCH_VEHICLE_ATTRIBUTES,
    payload: { vehicleId }
});

export const fetchVehicleAttributesSuccess = ({ vehicleAttributes }) => ({
    type:    FETCH_VEHICLE_ATTRIBUTES_SUCCESS,
    payload: { vehicleAttributes },
});

/**
 * Fetches data about one vehicle
 * @param {*} params.vehicleId Vehicle to fetch data for
 */
export const fetchVehicleOrdersLatest = ({vehicleId}) => ({
    type:    FETCH_VEHICLE_ORDERS_LATEST,
    payload: { vehicleId }
});

export const fetchVehicleOrdersLatestSuccess = ({ generalData }) => ({
    type:    FETCH_VEHICLE_ORDERS_LATEST_SUCCESS,
    payload: { generalData },
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

export const deleteVehicle = ({vehicleId}) => ({
    type: DELETE_VEHICLE,
    payload: {vehicleId}
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

export const setFetchingVehicle = (value) => ({
    type: SET_FETCHING_VEHICLE,
    payload: value
});

export const setFetchingVehicleOrders = (value) => ({
    type: SET_FETCHING_VEHICLE_ORDERS,
    payload: value
});

export const setFetchingVehicles = (value) => ({
    type: SET_FETCHING_VEHICLES,
    payload: value
});

export const setFetchingVehicleClient = (value) => ({
    type: SET_FETCHING_VEHICLE_CLIENT,
    payload: value
});

export const setFetchingVehicleAttributes = (value) => ({
    type: SET_FETCHING_VEHICLE_ATTRIBUTES,
    payload: value
});


export const setFetchingVehicleOrdersData = (value) => ({
    type: SET_FETCHING_ORDERS,
    payload: value
});

export const setFetchingVehicleNormHours = (value) => ({
    type: SET_FETCHING_NORM_HOURS,
    payload: value
});

export const setFetchingVehicleLabors = (value) => ({
    type: SET_FETCHING_LABORS,
    payload: value
});

export const setFetchingVehicleAppurtenances = (value) => ({
    type: SET_FETCHING_APPURTENANCES,
    payload: value
});

export const setFetchingVehicleRecommendations = (value) => ({
        type: SET_FETCHING_RECOMMENDATION,
            payload: value
});


/** State of fetcing lates information about vehicle's orders */
export const setFetchingOrdersLatest = (value) => ({
    type: SET_FETCHING_ORDERS_LATEST,
    payload: value
});

/** Set filtering page, automatically fetches orders */
export const setPageOrders = ({ page }) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_ORDERS,
            payload: { page }
        });
        return dispatch(fetchVehicleOrders());
    }
};

/** Set filtering page, automatically fetches vehicle norm hours */
export const setPageNormHours = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_NORM_HOURS,
            payload: {page}
        });
        return dispatch(fetchVehicleNormHours());
    }
};

/** Set filtering page, automatically fetches vehicle labors */
export const setPageLabors = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_LABORS,
            payload: {page}
        });
        return dispatch(fetchVehicleLabors());
    }
};

/** Set filtering page, automatically fetches vehicle appurtenances */
export const setPageAppurtenances = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_APPURTENANCES,
            payload: {page}
        });
        return dispatch(fetchVehicleAppurtenances());
    }
};

/** Set filtering page, automatically fetches vehicle recomendations */
export const setPageRecommendations = ({page}) => {
    return (dispatch) => {
        dispatch({
            type: SET_PAGE_RECOMMENDATIONS,
            payload: {page}
        });
        return dispatch(fetchVehicleRecommendations());
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

/** Set filtering query for norm hours, automatically fetches norm hours */
export const setNormHoursSearchQuery = ({query}) => {
    return (dispatch) => {
        dispatch({
            type: SET_NORM_HOURS_SEARCH_QUERY, // TODO
            payload: {query}
        });
        return dispatch(fetchVehicleNormHours());
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