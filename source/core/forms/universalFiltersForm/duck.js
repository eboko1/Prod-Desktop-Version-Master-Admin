/**
 * Constants
 * */
export const moduleName = 'universalFilters';
const prefix = `cpb/${moduleName}`;

export const FETCH_UNIVERSAL_FILTERS = `${prefix}/FETCH_UNIVERSAL_FILTERS`;
export const FETCH_UNIVERSAL_FILTERS_SUCCESS = `${prefix}/FETCH_UNIVERSAL_FILTERS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    orderComments:    [],
    services:         [],
    managers:         [],
    employees:        [],
    vehicleModels:    [],
    vehicleMakes:     [],
    creationsReasons: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_UNIVERSAL_FILTERS_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
// export const ordersSelector = createSelector(stateSelector, state => {
//     // console.log('ordersSelector', state.orders);
//
//     // return state.orders.valueSeq().toArray();
//     return state.data.orders;
// });

/**
 * Action Creators
 * */

export const fetchUniversalFilters = () => ({
    type: FETCH_UNIVERSAL_FILTERS,
});

export function fetchUniversalFiltersSuccess(filters) {
    return {
        type:    FETCH_UNIVERSAL_FILTERS_SUCCESS,
        payload: filters,
    };
}
