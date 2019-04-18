/**
 * Constants
 * */
export const moduleName = 'search';
const prefix = `cpb/${moduleName}`;

export const IS_FETCHING_BUSINESSES = `${prefix}/IS_FETCHING_BUSINESSES`;
export const SET_BUSINESS_SEARCH_QUERY = `${prefix}/SET_BUSINESS_SEARCH_QUERY`;
export const FETCH_BUSINESSES_SUCCESS = `${prefix}/FETCH_BUSINESSES_SUCCESS`;

export const IS_FETCHING_SUPPLIERS = `${prefix}/IS_FETCHING_SUPPLIERS`;
export const SET_SUPPLIER_SEARCH_QUERY = `${prefix}/SET_SUPPLIER_SEARCH_QUERY`;
export const FETCH_SUPPLIERS_SUCCESS = `${prefix}/FETCH_SUPPLIERS_SUCCESS`;

export const IS_FETCHING_PRODUCTS = `${prefix}/IS_FETCHING_PRODUCTS`;
export const SET_PRODUCT_SEARCH_QUERY = `${prefix}/SET_PRODUCT_SEARCH_QUERY`;
export const FETCH_PRODUCTS_SUCCESS = `${prefix}/FETCH_PRODUCTS_SUCCESS`;

export const IS_FETCHING_MANAGERS = `${prefix}/IS_FETCHING_MANAGERS`;
export const SET_MANAGER_SEARCH_QUERY = `${prefix}/SET_MANAGER_SEARCH_QUERY`;
export const FETCH_MANAGERS_SUCCESS = `${prefix}/FETCH_MANAGERS_SUCCESS`;

export const IS_FETCHING_BRANDS = `${prefix}/IS_FETCHING_BRANDS`;
export const SET_BRANDS_SEARCH_QUERY = `${prefix}/SET_BRANDS_SEARCH_QUERY`;
export const FETCH_BRANDS_SUCCESS = `${prefix}/FETCH_BRANDS_SUCCESS`;

/**
 * Reducer
 * */

const ReducerState = {
    errors:               [],
    businesses:           [],
    isFetchingBusinesses: false,
    businessSearchQuery:  null,

    managers:           [],
    isFetchingManagers: false,
    managerSearchQuery: null,

    suppliers:           [],
    isFetchingSuppliers: false,
    supplierSearchQuery: null,

    products:           [],
    isFetchingProducts: false,
    productSearchQuery: null,

    brands:            [],
    // brands:            [{ supplierId: 362, brandId: 12, brandName: 'ALKAR' }, { supplierId: 85, brandId: 167, brandName: 'KAYABA' }],
    isBrandsFetching:  false,
    brandsSearchQuery: null,
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_BUSINESSES_SUCCESS:
            return {
                ...state,
                businesses: payload,
            };

        case FETCH_MANAGERS_SUCCESS:
            return {
                ...state,
                managers: payload,
            };

        case FETCH_SUPPLIERS_SUCCESS:
            return {
                ...state,
                suppliers: payload,
            };

        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                products: payload,
            };

        case FETCH_BRANDS_SUCCESS:
            return {
                ...state,
                brands: payload,
            };

        case SET_BUSINESS_SEARCH_QUERY:
            return {
                ...state,
                businessSearchQuery: payload,
            };

        case SET_MANAGER_SEARCH_QUERY:
            return {
                ...state,
                managerSearchQuery: payload,
            };

        case SET_SUPPLIER_SEARCH_QUERY:
            return {
                ...state,
                supplierSearchQuery: payload,
            };

        case SET_PRODUCT_SEARCH_QUERY:
            return {
                ...state,
                productSearchQuery: payload,
            };

        case SET_BRANDS_SEARCH_QUERY:
            return {
                ...state,
                brandsSearchQuery: payload,
            };

        case IS_FETCHING_BUSINESSES:
            return {
                ...state,
                isFetchingBusinesses: payload,
            };

        case IS_FETCHING_MANAGERS:
            return {
                ...state,
                isFetchingManagers: payload,
            };

        case IS_FETCHING_SUPPLIERS:
            return {
                ...state,
                isFetchingSuppliers: payload,
            };

        case IS_FETCHING_PRODUCTS:
            return {
                ...state,
                isFetchingProducts: payload,
            };

        case IS_FETCHING_BRANDS:
            return {
                ...state,
                isFetchingBrands: payload,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];
export const selectBrandsByQuery = state => stateSelector(state).brands;

/**
 * Action Creators
 **/

export const setBusinessSearchQuery = query => ({
    type:    SET_BUSINESS_SEARCH_QUERY,
    payload: query,
});

export const setManagerSearchQuery = query => ({
    type:    SET_MANAGER_SEARCH_QUERY,
    payload: query,
});

export const setSupplierSearchQuery = query => ({
    type:    SET_SUPPLIER_SEARCH_QUERY,
    payload: query,
});

export const setProductSearchQuery = query => ({
    type:    SET_PRODUCT_SEARCH_QUERY,
    payload: query,
});

export const setBrandsSearchQuery = query => ({
    type:    SET_BRANDS_SEARCH_QUERY,
    payload: query,
});

export const fetchBusinessesSuccess = businesses => ({
    type:    FETCH_BUSINESSES_SUCCESS,
    payload: businesses,
});

export const fetchManagersSuccess = managers => ({
    type:    FETCH_MANAGERS_SUCCESS,
    payload: managers,
});

export const fetchSuppliersSuccess = suppliers => ({
    type:    FETCH_SUPPLIERS_SUCCESS,
    payload: suppliers,
});

export const fetchProductsSuccess = products => ({
    type:    FETCH_PRODUCTS_SUCCESS,
    payload: products,
});

export const fetchBrandsSuccess = brands => ({
    type:    FETCH_BRANDS_SUCCESS,
    payload: brands,
});

export const setIsFetchingBusinesses = isFetching => ({
    type:    IS_FETCHING_BUSINESSES,
    payload: isFetching,
});

export const setIsFetchingManagers = isFetching => ({
    type:    IS_FETCHING_MANAGERS,
    payload: isFetching,
});

export const setIsFetchingSuppliers = isFetching => ({
    type:    IS_FETCHING_SUPPLIERS,
    payload: isFetching,
});

export const setIsFetchingProducts = isFetching => ({
    type:    IS_FETCHING_PRODUCTS,
    payload: isFetching,
});

export const setIsFetchingBrands = isFetching => ({
    type:    IS_FETCHING_BRANDS,
    payload: isFetching,
});
