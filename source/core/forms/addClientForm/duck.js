/**
 * Constants
 * */

export const moduleName = 'addClientForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ADD_CLIENT_FORM = `${prefix}/FETCH_ADD_CLIENT_FORM`;
export const FETCH_ADD_CLIENT_FORM_SUCCESS = `${prefix}/FETCH_ADD_CLIENT_FORM_SUCCESS`;

export const ON_CHANGE_ADD_CLIENT_FORM = `${prefix}/ON_CHANGE_ADD_CLIENT_FORM`;

export const SUBMIT_ADD_CLIENT_FORM = `${prefix}/SUBMIT_ADD_CLIENT_FORM`;
export const SUBMIT_ADD_CLIENT_FORM_SUCCESS = `${prefix}/SUBMIT_ADD_CLIENT_FORM_SUCCESS`;

export const FETCH_VEHICLES_INFO = `${prefix}/FETCH_VEHICLES_INFO`;
export const FETCH_VEHICLES_INFO_SUCCESS = `${prefix}/FETCH_VEHICLES_INFO_SUCCESS`;

export const CREATE_CLIENT = `${prefix}/CREATE_CLIENT`;
export const CREATE_CLIENT_SUCCESS = `${prefix}/CREATE_CLIENT_SUCCESS`;

export const ADD_CLIENT_VEHICLE = `${prefix}/ADD_CLIENT_VEHICLE`;
export const REMOVE_CLIENT_VEHICLE = `${prefix}/REMOVE_CLIENT_VEHICLE`;

export const INIT_VEHICLES_INFO_FILTER_TYPE = 'INIT_VEHICLES_INFO_FILTER_TYPE';
export const YEAR_VEHICLES_INFO_FILTER_TYPE = 'YEAR_VEHICLES_INFO_FILTER_TYPE';
export const MAKE_VEHICLES_INFO_FILTER_TYPE = 'MAKE_VEHICLES_INFO_FILTER_TYPE';
export const MODEL_VEHICLES_INFO_FILTER_TYPE =
    'MODEL_VEHICLES_INFO_FILTER_TYPE';

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */

let errorId = 1;

const ReducerState = {
    fields: {
        vehicle: {},
        phones:  [],
        emails:  [],
    },
    lastFilterAction: '',
    vehicles:         [],
    data:             {},
    errors:           [],

    modifications: [],
    makes:         [],
    models:        [],
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ADD_CLIENT_FORM_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload,
                },
                lastFilterAction: INIT_VEHICLES_INFO_FILTER_TYPE,
            };

        case ON_CHANGE_ADD_CLIENT_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case CREATE_CLIENT_SUCCESS:
            return {
                ...state,
                fields:   {},
                vehicles: [],
            };

        case REMOVE_CLIENT_VEHICLE:
            const newVehicles = [ ...state.vehicles ];
            newVehicles.splice(payload, 1);

            return {
                ...state,
                vehicles: newVehicles,
            };

        case ADD_CLIENT_VEHICLE:
            return {
                ...state,
                vehicles:         [ ...state.vehicles, payload ],
                lastFilterAction: INIT_VEHICLES_INFO_FILTER_TYPE,
                fields:           {
                    ...state.fields,
                    vehicle: {},
                },
            };

        case FETCH_VEHICLES_INFO_SUCCESS:
            switch (payload.type) {
                case YEAR_VEHICLES_INFO_FILTER_TYPE:
                    return {
                        ...state,
                        makes:            payload.data.makes,
                        models:           [],
                        modifications:    [],
                        lastFilterAction: YEAR_VEHICLES_INFO_FILTER_TYPE,
                        fields:           {
                            ...state.fields,
                            vehicle: {
                                ...state.fields.vehicle,
                                modificationId: void 0,
                                modelId:        void 0,
                                makeId:         void 0,
                            },
                        },
                    };
                case MAKE_VEHICLES_INFO_FILTER_TYPE:
                    return {
                        ...state,
                        models:           payload.data.models,
                        modifications:    [],
                        lastFilterAction: MAKE_VEHICLES_INFO_FILTER_TYPE,
                        fields:           {
                            ...state.fields,
                            vehicle: {
                                ...state.fields.vehicle,
                                modificationId: void 0,
                                modelId:        void 0,
                            },
                        },
                    };
                case MODEL_VEHICLES_INFO_FILTER_TYPE:
                    return {
                        ...state,
                        modifications:    payload.data.modifications,
                        lastFilterAction: MODEL_VEHICLES_INFO_FILTER_TYPE,
                        fields:           {
                            ...state.fields,
                            vehicle: {
                                ...state.fields.vehicle,
                                modificationId: void 0,
                            },
                        },
                    };
                default:
                    return state;
            }

        case ADD_ERROR:
            return {
                ...state,
                errors: [ ...state.errors, { id: errorId++, ...payload }],
            };

        case HANDLE_ERROR:
            return {
                ...state,
                errors: state.errors.filter(({ id }) => id !== payload),
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const fetchAddClientForm = () => ({
    type: FETCH_ADD_CLIENT_FORM,
});

export function fetchAddClientFormSuccess(data) {
    return {
        type:    FETCH_ADD_CLIENT_FORM_SUCCESS,
        payload: data,
    };
}

export const onChangeAddClientForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_ADD_CLIENT_FORM,
    payload: fields,
    meta:    { form, field },
});

export const submitAddClientForm = addClientForm => ({
    type:    SUBMIT_ADD_CLIENT_FORM,
    payload: addClientForm,
});

export const submitAddClientFormSuccess = () => ({
    type: SUBMIT_ADD_CLIENT_FORM_SUCCESS,
});

export const createClient = clientEntity => ({
    type:    CREATE_CLIENT,
    payload: clientEntity,
});

export const createClientSuccess = () => ({
    type: CREATE_CLIENT_SUCCESS,
});

export const fetchVehiclesInfo = (type, filters) => ({
    type:    FETCH_VEHICLES_INFO,
    payload: { type, filters },
});

export const fetchVehiclesInfoSuccess = (type, data) => ({
    type:    FETCH_VEHICLES_INFO_SUCCESS,
    payload: { type, data },
});

export const addClientVehicle = vehicle => ({
    type:    ADD_CLIENT_VEHICLE,
    payload: vehicle,
});

export const removeClientVehicle = vehicleIndex => ({
    type:    REMOVE_CLIENT_VEHICLE,
    payload: vehicleIndex,
});

export const addError = error => ({
    type:    ADD_ERROR,
    payload: error,
    error:   true,
});

export const handleError = id => ({
    type:    HANDLE_ERROR,
    payload: id,
});
