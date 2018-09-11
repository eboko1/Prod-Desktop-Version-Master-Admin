/**
 * Constants
 * */
export const moduleName = 'addClientVehicleForm';
const prefix = `cpb/${moduleName}`;

export const INIT_VEHICLES_INFO_FILTER_TYPE = 'INIT_VEHICLES_INFO_FILTER_TYPE';
export const YEAR_VEHICLES_INFO_FILTER_TYPE = 'YEAR_VEHICLES_INFO_FILTER_TYPE';
export const MAKE_VEHICLES_INFO_FILTER_TYPE = 'MAKE_VEHICLES_INFO_FILTER_TYPE';
export const MODEL_VEHICLES_INFO_FILTER_TYPE =
    'MODEL_VEHICLES_INFO_FILTER_TYPE';

export const RESET_VEHICLE_FORM = `${prefix}/RESET_VEHICLE_FORM`;

export const FETCH_VEHICLES_INFO = `${prefix}/FETCH_VEHICLES_INFO`;
export const FETCH_VEHICLES_INFO_SUCCESS = `${prefix}/FETCH_VEHICLES_INFO_SUCCESS`;

export const ON_CHANGE_ADD_CLIENT_VEHICLE_FORM = `${prefix}/ON_CHANGE_ADD_CLIENT_VEHICLE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:           {},
    lastFilterAction: '',
    modifications:    [],
    makes:            [],
    models:           [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_ADD_CLIENT_VEHICLE_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case RESET_VEHICLE_FORM:
            return {
                ...state,
                fields:           {},
                lastFilterAction: INIT_VEHICLES_INFO_FILTER_TYPE,
                modifications:    [],
                makes:            [],
                models:           [],
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
                            ...state.fields.vehicle,
                            modificationId: void 0,
                            modelId:        void 0,
                            makeId:         void 0,
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
                            ...state.fields.vehicle,
                            modificationId: void 0,
                            modelId:        void 0,
                        },
                    };
                case MODEL_VEHICLES_INFO_FILTER_TYPE:
                    return {
                        ...state,
                        modifications:    payload.data.modifications,
                        lastFilterAction: MODEL_VEHICLES_INFO_FILTER_TYPE,
                        fields:           {
                            ...state.fields,
                            ...state.fields.vehicle,
                            modificationId: void 0,
                        },
                    };
                default:
                    return state;
            }

        default:
            return state;
    }
}

export const fetchVehiclesInfo = (type, filters) => ({
    type:    FETCH_VEHICLES_INFO,
    payload: { type, filters },
});

export const fetchVehiclesInfoSuccess = (type, data) => ({
    type:    FETCH_VEHICLES_INFO_SUCCESS,
    payload: { type, data },
});

export const onChangeAddClientVehicleForm = update => ({
    type:    ON_CHANGE_ADD_CLIENT_VEHICLE_FORM,
    payload: update,
});

export const resetAddClientVehicleForm = () => ({
    type: RESET_VEHICLE_FORM,
});
