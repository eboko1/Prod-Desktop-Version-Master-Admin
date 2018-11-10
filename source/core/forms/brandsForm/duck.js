/**
 * Constants
 * */
export const moduleName = 'brandsForm';
const prefix = `cpb/${moduleName}`;

import _ from 'lodash';

export const ON_CHANGE_BRANDS_FORM = `${prefix}/ON_CHANGE_BRANDS_FORM`;

export const FETCH_PRIORITY_BRANDS = `${prefix}/FETCH_PRIORITY_BRANDS`;
export const FETCH_PRIORITY_BRANDS_SUCCESS = `${prefix}/FETCH_PRIORITY_BRANDS_SUCCESS`;

export const CREATE_PRIORITY_BRAND = `${prefix}/CREATE_PRIORITY_BRAND`;
export const UPDATE_PRIORITY_BRAND = `${prefix}/UPDATE_PRIORITY_BRAND`;
export const DELETE_PRIORITY_BRAND = `${prefix}/DELETE_PRIORITY_BRAND`;

export const SET_SEARCH_SUPPLIERS = `${prefix}/SET_SEARCH_SUPPLIERS`;
export const SET_SEARCH_SUPPLIERS_SUCCESS = `${prefix}/SET_SEARCH_SUPPLIERS_SUCCESS`;

export const SET_SEARCH_PRODUCTS = `${prefix}/SET_SEARCH_PRODUCTS`;
export const SET_SEARCH_PRODUCTS_SUCCESS = `${prefix}/SET_SEARCH_PRODUCTS_SUCCESS`;

export const SET_SEARCH_BUSINESSES = `${prefix}/SET_SEARCH_BUSINESSES`;
export const SET_SEARCH_BUSINESSES_SUCCESS = `${prefix}/SET_SEARCH_BUSINESSES_SUCCESS`;

export const SET_SORT = `${prefix}/SET_SORT`;
export const SET_FILTER = `${prefix}/SET_FILTER`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:           {},
    priorityBrands:   null,
    sort:             {},
    filter:           {},
    businessId:       null,
    searchSuppliers:  {},
    searchProducts:   {},
    searchBusinesses: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_PRIORITY_BRANDS:
            return {
                ...state,
                searchSuppliers:  {},
                searchProducts:   {},
                searchBusinesses: {},
                fields:           {},
            };

        case ON_CHANGE_BRANDS_FORM:
            return {
                ...state,
                fields: _.merge(state.fields, payload),
            };

        case FETCH_PRIORITY_BRANDS_SUCCESS:
            return {
                ...state,
                priorityBrands: payload,
            };

        case SET_SORT:
            return {
                ...state,
                sort: {
                    ...state.sort,
                    ...payload,
                },
            };

        case SET_FILTER:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...payload,
                },
            };

        case SET_SEARCH_SUPPLIERS_SUCCESS:
            return {
                ...state,
                searchSuppliers: {
                    ...state.searchSuppliers,
                    [ payload.id ]: payload.results,
                },
            };

        case SET_SEARCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                searchBusinesses: {
                    ...state.searchBusinesses,
                    [ payload.id ]: payload.results,
                },
            };

        case SET_SEARCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                searchProducts: {
                    ...state.searchProducts,
                    [ payload.id ]: payload.results,
                },
            };

        default:
            return state;
    }
}

export const fetchPriorityBrands = () => ({
    type: FETCH_PRIORITY_BRANDS,
});

export const setSort = sort => ({
    type:    SET_SORT,
    payload: sort,
});

export const setFilter = filter => ({
    type:    SET_FILTER,
    payload: filter,
});

export const fetchPriorityBrandsSuccess = priorityBrands => ({
    type:    FETCH_PRIORITY_BRANDS_SUCCESS,
    payload: priorityBrands,
});

export const setSearchSuppliers = (id, query) => ({
    type:    SET_SEARCH_SUPPLIERS,
    payload: { id, query },
});

export const setSearchSuppliersSuccess = (id, results) => ({
    type:    SET_SEARCH_SUPPLIERS_SUCCESS,
    payload: { id, results },
});

export const setSearchProducts = (id, query) => ({
    type:    SET_SEARCH_PRODUCTS,
    payload: { id, query },
});

export const setSearchProductsSuccess = (id, results) => ({
    type:    SET_SEARCH_PRODUCTS_SUCCESS,
    payload: { id, results },
});

export const setSearchBusinesses = (id, query) => ({
    type:    SET_SEARCH_BUSINESSES,
    payload: { id, query },
});

export const setSearchBusinessesSuccess = (id, results) => ({
    type:    SET_SEARCH_BUSINESSES_SUCCESS,
    payload: { id, results },
});

export const updatePriorityBrand = (id, entity) => ({
    type:    UPDATE_PRIORITY_BRAND,
    payload: { id, entity },
});

export const deletePriorityBrand = id => ({
    type:    DELETE_PRIORITY_BRAND,
    payload: id,
});

export const createPriorityBrand = entity => ({
    type:    CREATE_PRIORITY_BRAND,
    payload: entity,
});

export const onChangeBrandsForm = update => ({
    type:    ON_CHANGE_BRANDS_FORM,
    payload: update,
});
