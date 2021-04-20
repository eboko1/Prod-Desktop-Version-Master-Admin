/**
 * Constants
 * */
export const moduleName = 'client';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT = `${prefix}/FETCH_CLIENT`;
export const FETCH_CLIENT_SUCCESS = `${prefix}/FETCH_CLIENT_SUCCESS`;

export const CREATE_ORDER_FOR_CLIENT = `${prefix}/CREATE_ORDER_FOR_CLIENT`;

export const CREATE_CLIENT_VEHICLE = `${prefix}/CREATE_CLIENT_VEHICLE`;
export const UPDATE_CLIENT_VEHICLE = `${prefix}/UPDATE_CLIENT_VEHICLE`;
export const DELETE_CLIENT_VEHICLE = `${prefix}/DELETE_CLIENT_VEHICLE`;

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

export const deleteClientVehicle = (clientId, clientVehicleId) => ({
    type:    DELETE_CLIENT_VEHICLE,
    payload: { clientVehicleId, clientId },
});

export const updateClientVehicle = (
    clientVehicleId,
    clientId,
    clientVehicle,
) => ({
    type:    UPDATE_CLIENT_VEHICLE,
    payload: { clientVehicleId, clientVehicle, clientId },
});

export const fetchClient = id => ({
    type:    FETCH_CLIENT,
    payload: { id },
});

export const fetchClientSuccess = clientEntity => ({
    type:    FETCH_CLIENT_SUCCESS,
    payload: clientEntity,
});

/**
 * Create new order(н/з)  which will contain specific client.
 * New client will be fetched by id , is is used to pass differences in data from different routes
 * @param {*} param0 {
 *      clientId - id of a client,
 *      managerId - id of a manager who created an order(current user)
 *      }
 */
 export const createOrderForClient = ({clientId, managerId, vehicleId}) => ({
    type: CREATE_ORDER_FOR_CLIENT,
    payload: {clientId, managerId, vehicleId}
});