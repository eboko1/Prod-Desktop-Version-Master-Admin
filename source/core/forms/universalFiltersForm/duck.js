/* eslint-disable comma-dangle */
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

const ReducerState = {
    fields:          {},
    errors:          [],
    orderComments:   void 0, // []
    services:        [],
    managers:        [],
    employees:       [],
    vehicleModels:   [],
    vehicleMakes:    [],
    creationReasons: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

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
                    ...state.fields,
                    ...payload,
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

export const onChangeUniversalFiltersForm = update => ({
    type:    ON_CHANGE_UNIVERSAL_FILTERS_FORM,
    payload: update,
});
