// vendor
import { createSelector } from 'reselect';

/**
 * Constants
 **/
export const moduleName = 'subscription';
const prefix = `cbp/${moduleName}`;

// global
export const FETCH_HEADER_DATA = `${prefix}/FETCH_HEADER_DATA`;
export const FETCH_HEADER_DATA_SUCCESS = `${prefix}/FETCH_HEADER_DATA_SUCCESS`;

// products
export const FETCH_SUBSCRIPTION_PRODUCTS = `${prefix}/FETCH_SUBSCRIPTION_PRODUCTS`;
export const FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS = `${prefix}/FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS`;

// history
export const FETCH_SUBSCRIPTION_HISTORY = `${prefix}/FETCH_SUBSCRIPTION_HISTORY`;
export const FETCH_SUBSCRIPTION_HISTORY_SUCCESS = `${prefix}/FETCH_SUBSCRIPTION_HISTORY_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    header:   {},
    products: [],
    history:  {
        packages:        [],
        suggestionGroup: [],
        filters:         {},
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_HEADER_DATA_SUCCESS:
            return { ...state, header: { ...payload } };

        case FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: payload,
            };

        case FETCH_SUBSCRIPTION_HISTORY_SUCCESS:
            return {
                ...state,
                history: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];

export const selectSubscriptionProducts = createSelector(
    [ stateSelector ],
    ({ products }) => {
        return products.reduce(
            (accumulator, currentValue) => {
                if (currentValue.rolesPackageId) {
                    return {
                        ...accumulator,
                        rolePackages: [ currentValue, ...accumulator.rolePackages ],
                    };
                }

                return {
                    ...accumulator,
                    suggestionGroup: [ currentValue, ...accumulator.suggestionGroup ],
                };
            },
            {
                rolePackages:    [],
                suggestionGroup: [],
            },
        );
    },
);

/**
 * Action Creators
 **/

export const fetchHeaderData = force => ({
    type:    FETCH_HEADER_DATA,
    payload: force,
});

export const fetchHeaderDataSuccess = payload => ({
    type: FETCH_HEADER_DATA_SUCCESS,
    payload,
});

export const fetchSubscriptionProducts = type => ({
    type:    FETCH_SUBSCRIPTION_PRODUCTS,
    payload: type,
});

export const fetchSubscriptionProductsSuccess = products => ({
    type:    FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS,
    payload: products,
});

export const fetchSubscriptionHistory = type => ({
    type:    FETCH_SUBSCRIPTION_PRODUCTS,
    payload: type,
});

export const fetchSubscriptionHistorySuccess = payload => ({
    type: FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS,
    payload,
});
