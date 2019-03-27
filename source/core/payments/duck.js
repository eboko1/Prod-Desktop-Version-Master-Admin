// vendor
import { createSelector } from 'reselect';
import moment from 'moment';
/**
 * Constants
 **/
export const moduleName = 'payments';
const prefix = `cbp/${moduleName}`;

export const SUBSCRIPTION_TYPES = Object.freeze({
    ROLES_PACKAGE:    'ROLES_PACKAGE',
    SUGGESTION_GROUP: 'SUGGESTION_GROUP',
});

// global
export const FETCH_HEADER_DATA = `${prefix}/FETCH_HEADER_DATA`;
export const FETCH_HEADER_DATA_SUCCESS = `${prefix}/FETCH_HEADER_DATA_SUCCESS`;

// products
export const FETCH_SUBSCRIPTION_PRODUCTS = `${prefix}/FETCH_SUBSCRIPTION_PRODUCTS`;
export const FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS = `${prefix}/FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS`;

// history
export const FETCH_SUBSCRIPTION_PACKAGES = `${prefix}/FETCH_SUBSCRIPTION_PACKAGES`;
export const FETCH_SUBSCRIPTION_PACKAGES_SUCCESS = `${prefix}/FETCH_SUBSCRIPTION_PACKAGES_SUCCESS`;

export const FETCH_SUBSCRIPTION_SUGGESTIONS = `${prefix}/FETCH_SUBSCRIPTION_SUGGESTIONS`;
export const FETCH_SUBSCRIPTION_SUGGESTIONS_SUCCESS = `${prefix}/FETCH_SUBSCRIPTION_SUGGESTIONS_SUCCESS`;

export const SET_SUBSCRIPTION_PACKAGES_FILTERS = `${prefix}/SET_SUBSCRIPTION_PACKAGES_FILTERS`;
export const SET_SUBSCRIPTION_SUGGESTIONS_FILTERS = `${prefix}/SET_SUBSCRIPTION_SUGGESTIONS_FILTERS`;

// subscription
export const SUBSCRIBE = `${prefix}/SUBSCRIBE`;
export const SUBSCRIBE_SUCCESS = `${prefix}/SUBSCRIBE_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    products: [],
    packages: {
        stats: {
            count: 1,
        },
        list:    [],
        filters: {
            startDatetime: moment().format('YYYY-MM-DD'),
            endDatetime:   moment()
                .add(3, 'month')
                .format('YYYY-MM-DD'),
            page: 1,
        },
    },
    suggestions: {
        stats: {
            count: 1,
        },
        list:    [],
        filters: {
            startDatetime: moment().format('YYYY-MM-DD'),
            endDatetime:   moment()
                .add(3, 'month')
                .format('YYYY-MM-DD'),
            page: 1,
        },
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_SUBSCRIPTION_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: payload,
            };

        case FETCH_SUBSCRIPTION_PACKAGES_SUCCESS:
            return {
                ...state,
                packages: {
                    filters: state.packages.filters,
                    ...payload,
                },
            };

        case FETCH_SUBSCRIPTION_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                suggestions: {
                    filters: state.suggestions.filters,
                    ...payload,
                },
            };

        case SET_SUBSCRIPTION_PACKAGES_FILTERS:
            return {
                ...state,
                packages: {
                    ...state.packages,
                    filters: {
                        ...state.packages.filters,
                        ...payload,
                    },
                },
            };

        case SET_SUBSCRIPTION_SUGGESTIONS_FILTERS:
            return {
                ...state,
                suggestions: {
                    ...state.suggestions,
                    filters: {
                        ...state.suggestions.filters,
                        ...payload,
                    },
                },
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

export const selectSubscriptionPackages = state => state.payments.packages;

export const selectSubscriptionSuggestions = state =>
    state.payments.suggestions;

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

export const fetchSubscriptionPackages = type => ({
    type:    FETCH_SUBSCRIPTION_PACKAGES,
    payload: type,
});

export const fetchSubscriptionPackagesSuccess = payload => ({
    type: FETCH_SUBSCRIPTION_PACKAGES_SUCCESS,
    payload,
});

export const fetchSubscriptionSuggestions = type => ({
    type:    FETCH_SUBSCRIPTION_SUGGESTIONS,
    payload: type,
});

export const fetchSubscriptionSuggestionsSuccess = payload => ({
    type: FETCH_SUBSCRIPTION_SUGGESTIONS_SUCCESS,
    payload,
});

export const subscribe = payload => ({
    type: SUBSCRIBE,
    payload,
});

export const subscribeSuccess = () => ({
    type: SUBSCRIBE_SUCCESS,
});

export const setSubscriptionPackagesFilters = filters => ({
    type:    SET_SUBSCRIPTION_PACKAGES_FILTERS,
    payload: filters,
});

export const setSubscriptionSuggestionsFilters = filters => ({
    type:    SET_SUBSCRIPTION_SUGGESTIONS_FILTERS,
    payload: filters,
});
