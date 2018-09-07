/**
 * Constants
 * */
export const moduleName = 'clientVehicleForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_CLIENT_VEHICLE_FORM = `${prefix}/ON_CHANGE_CLIENT_VEHICLE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_CLIENT_VEHICLE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

export const onChangeClientVehicleForm = update => ({
    type:    ON_CHANGE_CLIENT_VEHICLE_FORM,
    payload: update,
});
