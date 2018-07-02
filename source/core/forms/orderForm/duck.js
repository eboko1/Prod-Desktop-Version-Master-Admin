/**
 * Constants
 * */
export const moduleName = 'orderForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_ORDER_FORM = `${prefix}/FETCH_ORDER_FORM`;
export const FETCH_ORDER_FORM_SUCCESS = `${prefix}/FETCH_ORDER_FORM_SUCCESS`;

export const ON_CHANGE_ORDER_FORM = `${prefix}/ON_CHANGE_ORDER_FORM`;
export const ON_CHANGE_CLIENT_SEARCH_QUERY = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY`;

export const ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS = `${prefix}/ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS`;

export const ON_CLIENT_SELECT = `${prefix}/ON_CLIENT_SELECT`;

export const SUBMIT_ORDER_FORM = `${prefix}/SUBMIT_ORDER_FORM`;
export const SUBMIT_ORDER_FORM_SUCCESS = `${prefix}/SUBMIT_ORDER_FORM_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {
        status: {
            errors:     void 0,
            name:       'status',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        date: {
            errors:     void 0,
            name:       'date',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        post: {
            errors:     void 0,
            name:       'post',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        client: {
            errors:     void 0,
            name:       'client',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        phone: {
            errors:     void 0,
            name:       'phone',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        searchClientQuery: {
            errors:     void 0,
            name:       'searchClientQuery',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        email: {
            errors:     void 0,
            name:       'email',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        // paymentMethod: {
        //     errors:     void 0,
        //     name:       'paymentMethod',
        //     touched:    true,
        //     validating: false,
        //     value:      void 0,
        //     dirty:      false,
        // },
        service: {
            errors:     void 0,
            name:       'service',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
    allServices:         [],
    clients:             [],
    managers:            [],
    employees:           [],
    vehicles:            [],
    stations:            [],
    allDetails:          {},
    requisites:          [],
    searchClientsResult: {
        clients: [],
    },
    selectedClient: {
        requisites: [],
        phones:     [],
        emails:     [],
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        case FETCH_ORDER_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_ORDER_FORM:
            // console.group('→ REDUX');
            // console.log('@@payload', payload);
            // console.log('@@ meta field', meta.field);
            // console.log('@@ return', {
            //     ...state,
            //     fields: {
            //         [ meta.field ]: { ...payload[ meta.field ] },
            //     },
            // });
            // console.groupEnd();

            return {
                ...state,
                fields: {
                    ...state.fields,
                    [ meta.field ]: { ...payload[ meta.field ] },
                },
            };

        case SUBMIT_ORDER_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case ON_CLIENT_SELECT:
            return {
                ...state,
                selectedClient: payload,
                searchClientsResult: [],
                fields:         {
                    ...state.fields,
                    searchClientQuery: {
                        errors:     void 0,
                        name:       'searchClientQuery',
                        touched:    true,
                        validating: false,
                        value:      void 0,
                        dirty:      false,
                    },
                },
            };

        case ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS:
            return {
                ...state,
                searchClientsResult: payload,
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

export const fetchOrderForm = id => ({
    type:    FETCH_ORDER_FORM,
    payload: id,
});

export function fetchOrderFormSuccess(data) {
    return {
        type:    FETCH_ORDER_FORM_SUCCESS,
        payload: data,
    };
}

export const onChangeClientSearchQuery = searchQuery => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY,
    payload: searchQuery,
});

export const setClientSelection = client => ({
    type:    ON_CLIENT_SELECT,
    payload: client,
});

export const onChangeClientSearchQuerySuccess = data => ({
    type:    ON_CHANGE_CLIENT_SEARCH_QUERY_SUCCESS,
    payload: data,
});

export const onChangeOrderForm = (fields, { form, field }) => ({
    type:    ON_CHANGE_ORDER_FORM,
    payload: fields,
    meta:    { form, field },
});

export const submitOrderForm = addOrderForm => ({
    type:    SUBMIT_ORDER_FORM,
    payload: addOrderForm,
});

export const submitOrderFormSuccess = () => ({
    type: SUBMIT_ORDER_FORM_SUCCESS,
});
