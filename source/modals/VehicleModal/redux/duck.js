/**
 * This duck/saga is suposed to execute vehicle specific operations like, create, update and fetch.
 * It also has its logic for specific forms(because it is originaly created for it).
 */

/* Constants */
export const moduleName = 'vehicleModal';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

export const FETCH_VEHICLE_DATA_BY_VIN = `${prefix}/FETCH_VEHICLE_DATA_BY_VIN`;

export const FETCH_VEHICLE_YEARS = `${prefix}/FETCH_VEHICLE_YEARS`;
export const FETCH_VEHICLE_YEARS_SUCCESS = `${prefix}/FETCH_VEHICLE_YEARS_SUCCESS`;

export const FETCH_VEHICLE_MAKES = `${prefix}/FETCH_VEHICLE_MAKES`;
export const FETCH_VEHICLE_MAKES_SUCCESS = `${prefix}/FETCH_VEHICLE_MAKES_SUCCESS`;

export const FETCH_VEHICLE_MODELS = `${prefix}/FETCH_VEHICLE_MODELS`;
export const FETCH_VEHICLE_MODELS_SUCCESS = `${prefix}/FETCH_VEHICLE_MODELS_SUCCESS`;

export const FETCH_VEHICLE_MODIFICATIONS = `${prefix}/FETCH_VEHICLE_MODIFICATIONS`;
export const FETCH_VEHICLE_MODIFICATIONS_SUCCESS = `${prefix}/FETCH_VEHICLE_MODIFICATIONS_SUCCESS`;

export const FETCH_ALL_VEHICLE_DATA = `${prefix}/FETCH_ALL_VEHICLE_DATA`; // Fetch makes, modifications, models, tec.

export const CREATE_VEHICLE = `${prefix}/CREATE_VEHICLE`;
export const UPDATE_VEHICLE = `${prefix}/UPDATE_VEHICLE`;

export const CLEAR_VEHICLE_DATA = `${prefix}/CLEAR_VEHICLE_DATA`; //Delete from stage all makes, models, modifications and fields data

export const SET_FETCHING_ALL_VEHICLE_DATA = `${prefix}/SET_FETCHING_ALL_VEHICLE_DATA`;
export const SET_CLIENT_ID = `${prefix}/SET_CLIENT_ID`; //Required to create a new vehicle
export const SET_VIN = `${prefix}/SET_VIN`;
export const SET_NUMBER = `${prefix}/SET_NUMBER`;
export const SET_YEAR = `${prefix}/SET_YEAR`;
export const SET_MAKE_ID = `${prefix}/SET_MAKE_ID`;
export const SET_MODEL_ID = `${prefix}/SET_MODEL_ID`;
export const SET_MODIFICATION_ID = `${prefix}/SET_MODIFICATION_ID`;
export const SET_VEHICLE_INIT_VALUES = `${prefix}/SET_VEHICLE_INIT_VALUES`;

export const SET_MAKE_NAME = `${prefix}/SET_MAKE_NAME`;
export const SET_MODEL_NAME = `${prefix}/SET_MODEL_NAME`;
export const SET_SELECT_TYPE = `${prefix}/SET_SELECT_TYPE`;
export const SET_MODEL_DROPDOWN_STATE = `${prefix}/SET_MODEL_DROPDOWN_STATE`;



/**
 * Modes of the modal(or form) wich are supported. Each mode is used to define how to fetch,
 * represent, show data, and what to do with it.
 */
export const modes = Object.freeze({
    ADD: "ADD",
    EDIT: "EDIT",
    VIEW: "VIEW"
});

/* Reducer */

const ReducerState = {
    fields:           { // There are contained field values, used to fetch and store data or to create vehicle
        clientId: undefined, //Required to create new a vehicle
        vin: undefined,
        number: undefined,
        year: undefined,
        makeId: undefined,
        modelId: undefined,
        modificationId: undefined,

        // makeName and modelName is used to set plain text from API
        makeName: '',
        modelName: '',
        selectType: undefined,
        modelDropdownState: false,
    },

    fetchingAllVehicleData: false, //Years, makes, modifications, ....

    vehicle:          {}, // In a case we work in edit or view mode we have fetched vehicle here

    years:            [], // All years which are available for adding a new vehicle.
    makes:            [], // All makes which are available for adding a new vehicle, depends on selected "years"
    models:           [], // All models which are available for adding a new vehicle, depends on selected "makes"
    modifications:    [], // All modifications which are available for adding a new vehicle, depends on selected "modifications"
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
                    makeName: undefined,
                    modelName: undefined,
                    selectType: undefined
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
                    makeName: undefined,
                    modelName: undefined,
                    selectType: undefined
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

        case SET_MAKE_NAME:
            const { makeName } = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    makeName,
                }
            };

        case SET_MODEL_NAME:
            const { modelName } = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    modelName,
                }
            };

        case SET_SELECT_TYPE:
            const { selectType } = payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    selectType,
                }
            };
        case SET_MODEL_DROPDOWN_STATE:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    modelDropdownState: payload
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

        case CLEAR_VEHICLE_DATA:
            return {
                ...state,
                fields:           {
                    ...state.fields,
                    vin: undefined,
                    number: undefined,
                    year: undefined,
                    makeId: undefined,
                    modelId: undefined,
                    modificationId: undefined,
                    makeName: undefined,
                    modelName: undefined,
                    selectType: undefined,
                    modelDropdownState: false,
                },
                years:            [], 
                makes:            [],
                models:           [],
                modifications:    []
            };

        default:
            return state;
    }
}

/* Selectors */

export const selectVehicle = state => state[ moduleName ].vehicle;
export const selectFields = state => state[ moduleName ].fields;
export const selectClientId = state => state[ moduleName ].fields.clientId;
export const selectYears = state => state[ moduleName ].years;
export const selectMakes = state => state[ moduleName ].makes;
export const selectModels = state => state[ moduleName ].models;
export const selectModifications = state => state[ moduleName ].modifications;
export const selectFetchingAllVehicleData = state => state[ moduleName ].fetchingAllVehicleData;

/* Actions */

//Fetchers ---------------------------------------------------------------------------

export const fetchVehicle = ({vehicleId}) => ({
    type:    FETCH_VEHICLE,
    payload: { vehicleId },
});

export const fetchVehicleDataByVin = () => ({
    type:    FETCH_VEHICLE_DATA_BY_VIN,
});

export const fetchVehicleSuccess = ({vehicle}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: { vehicle },
});

/**
 * Fetch makes, modifications, models, tec. Also this actions initialized vehicle "fields" object where is stored data for creating or editing a vehicle
 * @param {*} params.vehicleId - id of a vehicle to fetch data for
 */
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

//Setters ---------------------------------------------------------------------------

export const setVehicleVin = ({vin}) => ({
    type:    SET_VIN,
    payload: { vin },
});

export const setVehicleNumber = ({number}) => ({
    type:    SET_NUMBER,
    payload: { number },
});

export const setVehicleYear = ({year}) => ({
    type:    SET_YEAR,
    payload: { year },
});

export const setVehicleMakeId = ({makeId}) => ({
    type:    SET_MAKE_ID,
    payload: { makeId },
});

export const setVehicleModelId = ({modelId}) => ({
    type:    SET_MODEL_ID,
    payload: { modelId },
});

export const setVehicleModificationId = ({modificationId}) => ({
    type:    SET_MODIFICATION_ID,
    payload: { modificationId },
});

export const setVehicleMakeName = ({makeName}) => ({
    type:    SET_MAKE_NAME,
    payload: { makeName },
});

export const setVehicleModelName = ({modelName}) => ({
    type:    SET_MODEL_NAME,
    payload: { modelName },
});

export const setSelectType = ({selectType}) => ({
    type:    SET_SELECT_TYPE,
    payload: { selectType },
});

export const setModelDropdownState = (modelDropdownState) => ({
    type:    SET_MODEL_DROPDOWN_STATE,
    payload: modelDropdownState,
});

/**
 * Set client id, a new vehicle can then be created with that client
 * @param {*} params.clientId - client for wich vehicle have to be created
 * @returns 
 */
export const setClientId = ({clientId}) => ({
    type:    SET_CLIENT_ID,
    payload: { clientId },
});

export const setFetchingAllVehicleData = (velue) => ({
    type:    SET_FETCHING_ALL_VEHICLE_DATA,
    payload: velue,
});

//Other ---------------------------------------------------------------------------

export const createVehicle = () => ({
    type: CREATE_VEHICLE,
});

export const updateVehicle = ({vehicleId}) => ({
    type:    UPDATE_VEHICLE,
    payload: { vehicleId },
});

/**
 * Delete from stage all makes, models, modifications, years fetched form the server.
 * Also delete "fields" data.
 */
export const clearVehicleData = () => ({
    type:    CLEAR_VEHICLE_DATA,
});

/**
 * Used to initialized vehicle values. Automatically fetches all required data.
 * @param [ initValues.number ]
 * @param [ initValues.vin ]
 * @param [ initValues.year ]
 * @param [ initValues.makeId ]
 * @param [ initValues.modelId ]
 * @param [ initValues.modificationId ]
 */
export const setVehicleInitValues = (initValues = {}) => ({
    type: SET_VEHICLE_INIT_VALUES,
    payload: initValues,
});