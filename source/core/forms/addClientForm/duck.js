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

export const CREATE_CLIENT = `${prefix}/CREATE_CLIENT`;
export const CREATE_CLIENT_SUCCESS = `${prefix}/CREATE_CLIENT_SUCCESS`;

export const ADD_CLIENT_VEHICLE = `${prefix}/ADD_CLIENT_VEHICLE`;
export const REMOVE_CLIENT_VEHICLE = `${prefix}/REMOVE_CLIENT_VEHICLE`;

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
    vehicles: [],
    data:     {},
    errors:   [],
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ADD_CLIENT_FORM_SUCCESS:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...payload,
                },
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
        /* eslint-disable no-case-declarations */
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
                vehicles: [ ...state.vehicles, payload ],
                fields:   {
                    ...state.fields,
                    vehicle: {},
                },
            };

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
