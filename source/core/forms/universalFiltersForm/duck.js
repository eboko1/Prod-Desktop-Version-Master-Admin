/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'universalFiltersForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_UNIVERSAL_FILTERS_FORM = `${prefix}/FETCH_UNIVERSAL_FILTERS_FORM`;
export const FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS = `${prefix}/FETCH_UNIVERSAL_FILTERS_FORM_SUCCESS`;

export const ON_CHANGE_UNIVERSAL_FILTERS_FORM = `${prefix}/ON_CHANGE_UNIVERSAL_FILTERS_FORM`;
export const SET_UNIVERSAL_FILTERS = `${prefix}/SET_UNIVERSAL_FILTERS`;

export const FETCH_STATS_COUNTS_PANEL = `${prefix}/FETCH_STATS_COUNTS_PANEL`;
export const FETCH_STATS_COUNTS_PANEL_SUCCESS = `${prefix}/FETCH_STATS_COUNTS_PANEL_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:          {},
    errors:          [],
    stats:           {},
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

        case SET_UNIVERSAL_FILTERS:
            return {
                ...state,
                fields: {
                    ...payload,
                },
            };

        case FETCH_STATS_COUNTS_PANEL_SUCCESS:
            return {
                ...state,
                stats: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state.forms[ moduleName ];
export const selectUniversalFilters = state => {
    const fields = state.forms.universalFiltersForm.fields;
    const filtersValues = {};
    Object.entries(fields).forEach(([ key, field ]) =>
        Object.assign(filtersValues, { [ key ]: field.value }), );

    return filtersValues;
};
// export const selectUniversalFilters = state =>
//     state.forms.universalFiltersForm.fields;

/**
 * Action Creators
 * */
// Universal Filters
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

export const setUniversalFilters = universalFilters => ({
    type:    SET_UNIVERSAL_FILTERS,
    payload: universalFilters,
});

// StatsCountsPanel
export const fetchStatsCounts = () => ({
    type: FETCH_STATS_COUNTS_PANEL,
});

export const fetchStatsCountsSuccess = stats => ({
    type:    FETCH_STATS_COUNTS_PANEL_SUCCESS,
    payload: stats,
});
