/**
 * Constants
 * */
export const moduleName = 'universalFiltersForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_UNIVERSAL_FILTERS_FORM = `${prefix}/FETCH_UNIVERSAL_FILTERS_FORM`;
export const FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS = `${prefix}/FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS`;

export const ON_CHANGE_UNIVERSAL_FILTERS_FORM = `${prefix}/ON_CHANGE_UNIVERSAL_FILTERS_FORM`;

/**
 * Reducer
 * */
//

const ReducerState = {
    fields: {
        make: {
            errors:     void 0,
            name:       'make',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        models: {
            errors:     void 0,
            name:       'models',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
    orderComments:    [],
    services:         [],
    managers:         [],
    employees:        [],
    vehicleModels:    [],
    vehicleMakes:     [],
    creationsReasons: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_UNIVERSAL_FILTERS_FORM:
            return {
                ...state,
                fields: {
                    [ meta.field ]: { ...payload[ meta.field ] },
                },
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

export const fetchUniversalFiltersForm = () => ({
    type: FETCH_UNIVERSAL_FILTERS_FORM,
});

export const fetchUniversalFiltersFormSuccess = filters => ({
    type:    FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS,
    payload: filters,
});

export const onChangeUniversalFiltersForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_UNIVERSAL_FILTERS_FORM,
    payload: fields,
    meta:    { form, field },
});
