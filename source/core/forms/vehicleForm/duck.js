/**Constants */
export const moduleName = 'vehicleForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_VEHICLE = `${prefix}/FETCH_VEHICLE`;
export const FETCH_VEHICLE_SUCCESS = `${prefix}/FETCH_VEHICLE_SUCCESS`;

/**
 * Modes of the modal(or form) wich are supported. Each modes is used to define how to fetch,
 * represent, show data, and what to do with it.
 */
export const modes = Object.freeze({
    ADD: "ADD_VEHICLE",
    EDIT: "EDIT_VEHICLE",
    VIEW: "VIEW_VEHICLE"
});

/** Reducer */

const ReducerState = {
    fields:           {},
    vehicle:          {}, //In a case we work in edit or view mode we have vehicle there
    modifications:    [],
    makes:            [],
    models:           [],
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

        default:
            return state;
    }
}

export const fetchVehicle = ({vehicleId}) => ({
    type:    FETCH_VEHICLE,
    payload: { vehicleId },
});

export const fetchVehicleSuccess = ({vehicle}) => ({
    type:    FETCH_VEHICLE_SUCCESS,
    payload: { vehicle },
});