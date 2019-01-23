/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'cashOrdersFiltersForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASH_ORDERS_FILTERS_FORM = `${prefix}/FETCH_CASH_ORDERS_FILTERS_FORM`;
export const FETCH_CASH_ORDERS_FILTERS_FORM_SUCCESS = `${prefix}/FETCH_CASH_ORDERS_FILTERS_FORM_SUCCESS`;

export const ON_CHANGE_CASH_ORDERS_FILTERS_FORM = `${prefix}/ON_CHANGE_CASH_ORDERS_FILTERS_FORM`;

export const CLEAR_CASH_ORDERS_FILTERS_FORM = `${prefix}/CLEAR_CASH_ORDERS_FILTERS_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:  {},
    filters: {
        query:   void 0,
        cashbox: void 0,
        date:    void 0,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CASH_ORDERS_FILTERS_FORM_SUCCESS:
            return {
                ...state,
                filters: {
                    ...payload,
                },
            };

        case ON_CHANGE_CASH_ORDERS_FILTERS_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case CLEAR_CASH_ORDERS_FILTERS_FORM:
            return {
                ...state,
                fields: {},
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state.forms[ moduleName ];


/**
 * Action Creators
 * */

export const fetchUniversalFiltersForm = () => ({
    type: FETCH_CASH_ORDERS_FILTERS_FORM,
});

export const fetchUniversalFiltersFormSuccess = filters => ({
    type:    FETCH_CASH_ORDERS_FILTERS_FORM_SUCCESS,
    payload: filters,
});

export const onChangeCashOrdersFiltersForm = update => ({
    type:    ON_CHANGE_CASH_ORDERS_FILTERS_FORM,
    payload: update,
});

export const clearUniversalFilters = () => ({
    type: CLEAR_CASH_ORDERS_FILTERS_FORM,
});
