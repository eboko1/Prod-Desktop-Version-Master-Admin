// vendor
import { call, put, all, takeLatest, delay } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchBusinessesSuccess,
    setIsFetchingBusinesses,
    fetchManagersSuccess,
    setIsFetchingManagers,
    fetchSuppliersSuccess,
    setIsFetchingSuppliers,
    fetchProductsSuccess,
    setIsFetchingProducts,
    fetchBrandsSuccess,
    setIsFetchingBrands,
    fetchStoreProductsSuccess,
    setIsFetchingStoreProducts,
} from './duck';

import {
    SET_BUSINESS_SEARCH_QUERY,
    SET_MANAGER_SEARCH_QUERY,
    SET_SUPPLIER_SEARCH_QUERY,
    SET_PRODUCT_SEARCH_QUERY,
    SET_BRANDS_SEARCH_QUERY,
    SET_STORE_PRODUCTS_SEARCH_QUERY,
} from './duck';

function* handleBusinessesSearchSaga({ payload: query }) {
    yield delay(1000);

    if (query && query.length > 2) {
        yield put(setIsFetchingBusinesses(true));
        const businesses = yield call(fetchAPI, 'GET', 'businesses/search', {
            search: query,
        });
        yield put(fetchBusinessesSuccess(businesses));
        yield put(setIsFetchingBusinesses(false));
    }
}

function* handleManagersSearchSaga({ payload: query }) {
    yield delay(1000);
    yield put(setIsFetchingManagers(true));
    const managers = yield call(fetchAPI, 'GET', 'managers/search', {
        search: query,
    });
    yield put(fetchManagersSuccess(managers));
    yield put(setIsFetchingManagers(false));
}

function* handleSuppliersSearchSaga({ payload: query }) {
    yield delay(1000);

    yield put(setIsFetchingSuppliers(true));
    const { suppliers } = yield call(
        fetchAPI,
        'GET',
        '/tecdoc/suppliers/search',
        {
            query,
        },
    );
    yield put(fetchSuppliersSuccess(suppliers));
    yield put(setIsFetchingSuppliers(false));
}

function* handleProductsSearchSaga({ payload: query }) {
    yield delay(1000);

    yield put(setIsFetchingProducts(true));
    const { products } = yield call(
        fetchAPI,
        'GET',
        '/tecdoc/products/search',
        {
            query,
        },
    );
    yield put(fetchProductsSuccess(products));
    yield put(setIsFetchingProducts(false));
}

function* handleBrandsSearchSaga({ payload: query }) {
    yield delay(1000);

    yield put(setIsFetchingBrands(true));
    const brands = yield call(fetchAPI, 'GET', '/brands/search', {
        query,
    });
    yield put(fetchBrandsSuccess(brands));
    yield put(setIsFetchingBrands(false));
}

function* handleStoreProductsSearchSaga({ payload: query }) {
    yield delay(1000);

    yield put(setIsFetchingStoreProducts(true));

    const storeProducts = yield call(
        fetchAPI,
        'GET',
        '/store_products/search',
        {
            query: query ? query : '',
        },
    );
    yield put(fetchStoreProductsSuccess(storeProducts));
    yield put(setIsFetchingStoreProducts(false));
}

export function* saga() {
    yield all([
        takeLatest(SET_PRODUCT_SEARCH_QUERY, handleProductsSearchSaga),
        takeLatest(SET_SUPPLIER_SEARCH_QUERY, handleSuppliersSearchSaga),
        takeLatest(SET_BUSINESS_SEARCH_QUERY, handleBusinessesSearchSaga),
        takeLatest(SET_MANAGER_SEARCH_QUERY, handleManagersSearchSaga),
        takeLatest(SET_BRANDS_SEARCH_QUERY, handleBrandsSearchSaga),
        takeLatest(
            SET_STORE_PRODUCTS_SEARCH_QUERY,
            handleStoreProductsSearchSaga,
        ),
    ]);
}
