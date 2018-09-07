/**
 * Constants
 * */
export const moduleName = 'client';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT = `${prefix}/FETCH_CLIENT`;
export const FETCH_CLIENT_SUCCESS = `${prefix}/FETCH_CLIENT_SUCCESS`;

export const CREATE_CLIENT_VEHICLE = `${prefix}/CREATE_CLIENT_VEHICLE`;

/**
 * Reducer
 * */

const ReducerState = {
    clientEntity: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CLIENT_SUCCESS:
            return {
                ...state,
                clientEntity: payload,
            };

        default:
            return state;
    }
}

export const createClientVehicle = (clientId, clientVehicle) => ({
    type:    CREATE_CLIENT_VEHICLE,
    payload: { clientId, clientVehicle },
});

export const fetchClient = id => ({
    type:    FETCH_CLIENT,
    payload: { id },
});

export const fetchClientSuccess = clientEntity => ({
    type:    FETCH_CLIENT_SUCCESS,
    payload: clientEntity,
});
