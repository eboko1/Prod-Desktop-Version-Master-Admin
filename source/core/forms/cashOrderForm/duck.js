/**
 * Constants
 * */
export const moduleName = 'cashOrderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_CASH_ORDER_NEXT_ID = `${prefix}/FETCH_CASH_ORDER_NEXT_ID`;
export const FETCH_CASH_ORDER_NEXT_ID_SUCCESS = `${prefix}/FETCH_CASH_ORDER_NEXT_ID_SUCCESS`;

export const FETCH_CASH_ORDER_FORM = `${prefix}/FETCH_CASH_ORDER_FORM`;
export const FETCH_CASH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_CASH_ORDER_FORM_SUCCESS`;

export const CREATE_CASH_ORDER = `${prefix}/CREATE_CASH_ORDER`;
export const CREATE_CASH_ORDER_SUCCESS = `${prefix}/CREATE_CASH_ORDER`;

export const ON_CHANGE_CASH_ORDER_FORM = `${prefix}/ON_CHANGE_CASH_ORDER_FORM`;
export const CLEAR_CASH_ORDER_FORM = `${prefix}/CLEAR_CASH_ORDER_FILTER_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:           {},
    counterpartyList: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_CASH_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDER_NEXT_ID_SUCCESS:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_CASH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                counterpartyList: [ ...payload ],
            };

        case CREATE_CASH_ORDER_SUCCESS:
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

export const selectCounterpartyList = state =>
    state.forms.cashOrderForm.counterpartyList;

/**
 * Action Creators
 * */

export const fetchCashOrderNextId = () => ({
    type: FETCH_CASH_ORDER_NEXT_ID,
});

export const fetchCashOrderNextIdSuccess = orderId => ({
    type:    FETCH_CASH_ORDER_NEXT_ID_SUCCESS,
    payload: orderId,
});

export const fetchCashOrderForm = endpoint => ({
    type:    FETCH_CASH_ORDER_FORM,
    payload: endpoint,
});

export const fetchCashOrderFormSuccess = data => ({
    type:    FETCH_CASH_ORDER_FORM_SUCCESS,
    payload: data,
});

export const createCashOrder = payload => ({
    type: CREATE_CASH_ORDER,
    payload,
});

export const createCashOrderSuccess = () => ({
    type: CREATE_CASH_ORDER_SUCCESS,
});

export const onChangeCashOrderForm = fields => ({
    type:    ON_CHANGE_CASH_ORDER_FORM,
    payload: fields,
});

export const clearCashOrderForm = () => ({
    type: CLEAR_CASH_ORDER_FORM,
});
