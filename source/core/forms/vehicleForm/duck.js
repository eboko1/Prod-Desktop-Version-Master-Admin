/* Constants */
export const moduleName = 'vehicleForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

export const FETCH_VEHICLE_YEARS = `${prefix}/FETCH_VEHICLE_YEARS`;
export const FETCH_VEHICLE_YEARS_SUCCESS = `${prefix}/FETCH_VEHICLE_YEARS_SUCCESS`;

export const FETCH_VEHICLE_MAKES = `${prefix}/FETCH_VEHICLE_MAKES`;
export const FETCH_VEHICLE_MAKES_SUCCESS = `${prefix}/FETCH_VEHICLE_MAKES_SUCCESS`;

export const FETCH_VEHICLE_MODELS = `${prefix}/FETCH_VEHICLE_MODELS`;
export const FETCH_VEHICLE_MODELS_SUCCESS = `${prefix}/FETCH_VEHICLE_MODELS_SUCCESS`;

export const FETCH_VEHICLE_MODIFICATIONS = `${prefix}/FETCH_VEHICLE_MODIFICATIONS`;
export const FETCH_VEHICLE_MODIFICATIONS_SUCCESS = `${prefix}/FETCH_VEHICLE_MODIFICATIONS_SUCCESS`;

export const FETCH_ALL_VEHICLE_DATA = `${prefix}/FETCH_ALL_VEHICLE_DATA`;

export const CREATE_VEHICLE = `${prefix}/CREATE_VEHICLE`;


export const SET_FETCHING_ALL_VEHICLE_DATA = `${prefix}/SET_FETCHING_ALL_VEHICLE_DATA`;
export const SET_CLIENT_ID = `${prefix}/SET_CLIENT_ID`;
export const SET_VIN = `${prefix}/SET_VIN`;
export const SET_NUMBER = `${prefix}/SET_NUMBER`;
export const SET_YEAR = `${prefix}/SET_YEAR`;
export const SET_MAKE_ID = `${prefix}/SET_MAKE_ID`;
export const SET_MODEL_ID = `${prefix}/SET_MODEL_ID`;
export const SET_MODIFICATION_ID = `${prefix}/SET_MODIFICATION_ID`;


/**
 * Modes of the modal(or form) wich are supported. Each modes is used to define how to fetch,
 * represent, show data, and what to do with it.
 */
export const modes = Object.freeze({
    ADD: "ADD",
    EDIT: "EDIT",
    VIEW: "VIEW"
});

/* Reducer */

const ReducerState = {
    fields:           { // There are contained field values, we use them to fetch data and create vehicle
        clientId: undefined,
        vin: undefined,
        number: undefined,
        year: undefined,
        makeId: undefined,
        modelId: undefined,
        modificationId: undefined,
    },

    fetchingAllVehicleData: false, //Years, makes, modifications, ....

    vehicle:          {}, // In a case we work in edit or view mode we have fetched vehicle there

    years:            [], // All years which are availabel for adding a new vehicle.
    makes:            [], // All makes which are availabel for adding a new vehicle, depends on selected "years"
    models:           [], // All models which are availabel for adding a new vehicle, depends on selected "makes"
    modifications:    [], // All modifications which are availabel for adding a new vehicle, depends on selected "modifications"
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_VEHICLE_SUCCESS:
            const { vehicle } = payload;
            return {
                ...state,
                vehicle: vehicle,
            };
        case FETCH_VEHICLE_YEARS_SUCCESS:
            const { years } = payload;
            return {
                ...state,
                years: years,
                //Clear old data
                makes: [],
                models: [],
                modifications: [],
            };
        case FETCH_VEHICLE_MAKES_SUCCESS:
            const { makes } = payload;
            return {
                ...state,
                makes: makes,
                //Clear old data
                models: [],
                modifications: [],
            };
        case FETCH_VEHICLE_MODELS_SUCCESS:
            const { models } = payload;
            return {
                ...state,
                models: models,
                //Clear other old data
                modifications: [],
            };
        case FETCH_VEHICLE_MODIFICATIONS_SUCCESS:
            const { modifications } = payload;
            return {
                ...state,
                modifications: modifications,
            };

        case SET_VIN:
            const {vin} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    vin
                }
            };

        case SET_NUMBER:
            const {number} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    number
                }
            };

        case SET_YEAR:
            const {year} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    year,
                    makeId: undefined,
                    modelId: undefined,
                    modificationId: undefined,
                }
            };

        case SET_MAKE_ID:
            const {makeId} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    makeId,
                    modelId: undefined,
                    modificationId: undefined,
                }
            };

        case SET_MODEL_ID:
            const {modelId} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    modelId,
                    modificationId: undefined,
                }
            };

        case SET_MODIFICATION_ID:
            const {modificationId} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    modificationId
                }
            };
        
        case SET_CLIENT_ID:
            const {clientId} = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    clientId
                }
            };
        
        case SET_FETCHING_ALL_VEHICLE_DATA:
            return {
                ...state,
                fetchingAllVehicleData: payload
            };

        default:
            return state;
    }
}

/* Selectors */

export const selectVehicle = state => state.forms[ moduleName ].vehicle;
export const selectFields = state => state.forms[ moduleName ].fields;
export const selectYears = state => state.forms[ moduleName ].years;
export const selectMakes = state => state.forms[ moduleName ].makes;
export const selectModels = state => state.forms[ moduleName ].models;
export const selectModifications = state => state.forms[ moduleName ].modifications;
export const selectFetchingAllVehicleData = state => state.forms[ moduleName ].fetchingAllVehicleData;

/* Actions */

export const fetchVehicle = ({vehicleId}) => ({
    type:    FETCH_VEHICLE,
    payload: { vehicleId },
});

export const fetchVehicleSuccess = ({vehicle}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: { vehicle },
});

export const fetchAllVehicleData = ({vehicleId}) => ({
    type:    FETCH_ALL_VEHICLE_DATA,
    payload: { vehicleId },
});

export const fetchVehicleYears = () => ({
    type:    FETCH_VEHICLE_YEARS,
});

export const fetchVehicleYearsSuccess = ({years}) => ({
    type:    FETCH_VEHICLE_YEARS_SUCCESS,
    payload: { years },
});

export const fetchVehicleMakes = () => ({
    type:    FETCH_VEHICLE_MAKES,
});

export const fetchVehicleMakesSuccess = ({makes}) => ({
    type:    FETCH_VEHICLE_MAKES_SUCCESS,
    payload: { makes },
});

export const fetchVehicleModels = () => ({
    type:    FETCH_VEHICLE_MODELS,
});

export const fetchVehicleModelsSuccess = ({models}) => ({
    type:    FETCH_VEHICLE_MODELS_SUCCESS,
    payload: { models },
});

export const fetchVehicleModifications = () => ({
    type:    FETCH_VEHICLE_MODIFICATIONS,
});

export const fetchVehicleModificationsSuccess = ({modifications}) => ({
    type:    FETCH_VEHICLE_MODIFICATIONS_SUCCESS,
    payload: { modifications },
});

export const setVehicleVin = ({vin}) => ({
    type:    SET_VIN,
    payload: { vin },
});

export const setVehicleNumber = ({number}) => ({
    type:    SET_NUMBER,
    payload: { number },
});

export const setVehicleYear = ({year}) => {
    return function (dispatch) {
        dispatch({
            type:    SET_YEAR,
            payload: { year },
        });
        // dispatch(fetchVehicleMakes());
    }
}

export const setVehicleMakeId = ({makeId}) => {
    return function (dispatch) {
        dispatch({
            type:    SET_MAKE_ID,
            payload: { makeId },
        });
        // dispatch(fetchVehicleModels());
    }
}

export const setVehicleModelId = ({modelId}) => {
    return function (dispatch) {
        dispatch({
            type:    SET_MODEL_ID,
            payload: { modelId },
        });
        // dispatch(fetchVehicleModifications());
    }
}

export const setVehicleModificationId = ({modificationId}) => ({
    type:    SET_MODIFICATION_ID,
    payload: { modificationId },
});

export const setClientId = ({clientId}) => ({
    type:    SET_CLIENT_ID,
    payload: { clientId },
});

export const setFetchingAllVehicleData = (velue) => ({
    type:    SET_FETCHING_ALL_VEHICLE_DATA,
    payload: velue,
});

export const createVehicle = () => ({
    type: CREATE_VEHICLE,
});