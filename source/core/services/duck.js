/**
 * Constants
 * */
export const moduleName = 'services';
const prefix = `cpb/${moduleName}`;

export const FETCH_SERVICES = `${prefix}/FETCH_SERVICES`;
export const FETCH_SERVICES_SUCCESS = `${prefix}/FETCH_SERVICES_SUCCESS`;

export const CREATE_SERVICE_PRIORITY = `${prefix}/CREATE_SERVICE_PRIORITY`;

export const ON_CHANGE_SERVICES_FORM = `${prefix}/ON_CHANGE_SERVICES_FORM`;

export const UPDATE_SERVICE = `${prefix}/UPDATE_SERVICE`;
export const CREATE_SERVICE = `${prefix}/CREATE_SERVICE`;
export const DELETE_SERVICE = `${prefix}/DELETE_SERVICE`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:   {},
    services: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SERVICES_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_SERVICES_SUCCESS:
            return {
                ...state,
                services: payload,
            };

        case UPDATE_SERVICE:
            return {
                ...state,
                editServiceId: null,
            };

        case CREATE_SERVICE:
            return {
                ...state,
                createServiceForm: false,
            };

        default:
            return state;
    }
}

export const onChangeServicesForm = update => ({
    type:    ON_CHANGE_SERVICES_FORM,
    payload: update,
});

export const fetchServices = businessId => ({
    type:    FETCH_SERVICES,
    payload: businessId,
});

export const fetchServicesSuccess = data => ({
    type:    FETCH_SERVICES_SUCCESS,
    payload: data,
});

export const updateService = (brandId, entity) => ({
    type:    UPDATE_SERVICE,
    payload: { brandId, entity },
});

export const createService = (brandId, entity) => ({
    type:    CREATE_SERVICE,
    payload: { brandId, entity },
});

export const deleteService = id => ({
    type:    DELETE_SERVICE,
    payload: id,
});
