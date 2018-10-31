/**
 * Constants
 * */
export const moduleName = 'clientVehicleForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_CLIENT_VEHICLE_FORM = `${prefix}/ON_CHANGE_CLIENT_VEHICLE_FORM`;
export const SET_EDITABLE_ITEM = `${prefix}/SET_EDITABLE_ITEM`;
export const SET_EDIT_VEHICLE = `${prefix}/SET_EDIT_VEHICLE`;
export const SET_SELECTED_VEHICLE = `${prefix}/SET_SELECTED_VEHICLE`;

export const ADD_ERROR = `${prefix}/ADD_ERROR`;
export const HANDLE_ERROR = `${prefix}/HANDLE_ERROR`;
/**
 * Reducer
 * */
let errorId = 1;

const ReducerState = {
    errors:          [],
    fields:          {},
    editableItem:    null,
    editVehicle:     false,
    selectedVehicle: null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
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

        case ON_CHANGE_CLIENT_VEHICLE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };
        case SET_EDITABLE_ITEM:
            return {
                ...state,
                editableItem:    payload,
                editVehicle:     false,
                selectedVehicle: null,
            };

        case SET_EDIT_VEHICLE:
            return {
                ...state,
                editVehicle: payload,
            };

        case SET_SELECTED_VEHICLE:
            return {
                ...state,
                selectedVehicle: payload,
                editVehicle:     false,
            };

        default:
            return state;
    }
}

export const onChangeClientVehicleForm = update => ({
    type:    ON_CHANGE_CLIENT_VEHICLE_FORM,
    payload: update,
});

export const setEditableItem = payload => ({
    type: SET_EDITABLE_ITEM,
    payload,
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

export const setEditVehicle = edit => ({
    type:    SET_EDIT_VEHICLE,
    payload: edit,
});

export const setSelectedVehicle = vehicle => ({
    type:    SET_SELECTED_VEHICLE,
    payload: vehicle,
});
