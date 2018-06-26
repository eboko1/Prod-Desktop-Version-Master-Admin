/**
 * Constants
 * */
export const moduleName = 'addOrder';
const prefix = `cpb/${moduleName}`;

export const FETCH_ADD_ORDER = `${prefix}/FETCH_ADD_ORDER`;
export const FETCH_ADD_ORDER_SUCCESS = `${prefix}/FETCH_ADD_ORDER_SUCCESS`;
export const FETCH_ADD_ORDER_FAIL = `${prefix}/FETCH_ADD_ORDER_FAIL`;

/**
 * Reducer
 * */
// const ReducerState = Record({
//     orders: new List([]),
// });

const ReducerState = {
    allServices: [],
    clients:     [],
    managers:    [],
    employees:   [],
    vehicles:    [],
    stations:    [],
    allDetails:  {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_ADD_ORDER_SUCCESS:
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

/**
 * Action Creators
 * */

export function fetchAddOrder() {
    return {
        type: FETCH_ADD_ORDER,
    };
}

export function fetchAddOrderSuccess(order) {
    return {
        type:    FETCH_ADD_ORDER_SUCCESS,
        payload: order,
    };
}

export function fetchAddOrderFail(error) {
    return {
        type:    FETCH_ADD_ORDER_FAIL,
        payload: error,
        error:   true,
    };
}
