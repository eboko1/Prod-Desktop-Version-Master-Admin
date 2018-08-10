/**
 * Constants
 * */

export const moduleName = 'addClientForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ADD_CLIENT_FORM = `${prefix}/FETCH_ADD_CLIENT_FORM`;
export const FETCH_ADD_CLIENT_FORM_SUCCESS = `${prefix}/FETCH_ADD_CLIENT_FORM_SUCCESS`;

export const ON_CHANGE_ADD_CLIENT_FORM = `${prefix}/ON_CHANGE_ADD_CLIENT_FORM`;
export const ON_CHANGE_ADD_CLIENT_FORM_ARRAY_FIELD = `${prefix}/ON_CHANGE_ADD_CLIENT_FORM_ARRAY_FIELD`;

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
/**
 * Reducer
 * */

const mergeArrays = (base, toMerge) => {
    if (!toMerge) {
        return base;
    }

    return base.map((value, index) => toMerge[ index ] || value);
};

export const customFieldValue = (name, value) => ({
    errors:     void 0,
    name:       name,
    touched:    true,
    validating: false,
    value:      value,
    dirty:      true,
});

export const defaultFieldValue = name => customFieldValue(name, void 0);

const ReducerState = {
    fields: {
        vehicle: {
            modelId:        defaultFieldValue('modelId'),
            makeId:         defaultFieldValue('makeId'),
            year:           defaultFieldValue('year'),
            modificationId: defaultFieldValue('modificationId'),
        },
        name:       defaultFieldValue('name'),
        surname:    defaultFieldValue('surname'),
        patronymic: defaultFieldValue('patronymic'),
        gender:     defaultFieldValue('gender'),
        phones:     [ defaultFieldValue('phones[0]') ],
        emails:     [ defaultFieldValue('emails[0]') ],
    },
    lastFilterAction: '',
    vehicles:         [],
    data:             {},

    modifications: [],
    makes:         [],
    models:        [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        // case ON_CHANGE_ADD_CLIENT_FORM:
        //     return {
        //         ...state,
        //         fields: {
        //             ...state.fields,
        //             [ meta.field ]: { ...payload[ meta.field ] },
        //         },
        //     };

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
                    vehicle: {
                        ...state.fields.vehicle,
                        ...payload.vehicle,
                    },
                    phones: mergeArrays(state.fields.phones, payload.phones),
                    emails: mergeArrays(state.fields.emails, payload.emails),
                },
            };

        case ON_CHANGE_ADD_CLIENT_FORM_ARRAY_FIELD:
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
                fields: {
                    vehicle: {
                        modelId:        defaultFieldValue('modelId'),
                        makeId:         defaultFieldValue('makeId'),
                        year:           defaultFieldValue('year'),
                        modificationId: defaultFieldValue('modificationId'),
                    },
                    name:       defaultFieldValue('name'),
                    surname:    defaultFieldValue('surname'),
                    patronymic: defaultFieldValue('patronymic'),
                    gender:     defaultFieldValue('gender'),
                    phones:     [ defaultFieldValue('phones[0]') ],
                    emails:     [ defaultFieldValue('emails[0]') ],
                },
                vehicles: [],
            };

        case SUBMIT_ADD_CLIENT_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
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
                vehicles: [ ...state.vehicles, payload ],
                fields:   {
                    ...state.fields,
                    vehicle: {
                        modelId:        defaultFieldValue('modelId'),
                        makeId:         defaultFieldValue('makeId'),
                        year:           defaultFieldValue('year'),
                        modificationId: defaultFieldValue('modificationId'),
                    },
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
                                modificationId: defaultFieldValue(
                                    'modificationId',
                                ),
                                modelId: defaultFieldValue('modelId'),
                                makeId:  defaultFieldValue('makeId'),
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
                                modificationId: defaultFieldValue(
                                    'modificationId',
                                ),
                                modelId: defaultFieldValue('modelId'),
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
                                modificationId: defaultFieldValue(
                                    'modificationId',
                                ),
                            },
                        },
                    };
                default:
                    return state;
            }

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

export const updateArrayField = payload => ({
    type: ON_CHANGE_ADD_CLIENT_FORM_ARRAY_FIELD,
    payload,
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
