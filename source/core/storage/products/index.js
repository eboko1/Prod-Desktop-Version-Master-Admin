// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { createSelector } from 'reselect';
// import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

/**
 * Constants
 **/
export const moduleName = 'store_products';
const prefix = `cpb/${moduleName}`;

export const PRODUCTS_EXCEL_IMPORT_VALIDATE = `${prefix}/PRODUCTS_EXCEL_IMPORT_VALIDATE`;
export const PRODUCTS_EXCEL_IMPORT_VALIDATE_SUCCESS = `${prefix}/PRODUCTS_EXCEL_IMPORT_VALIDATE_SUCCESS`;
export const PRODUCTS_EXCEL_IMPORT = `${prefix}/PRODUCTS_EXCEL_IMPORT`;
export const PRODUCTS_EXCEL_IMPORT_SUCCESS = `${prefix}/PRODUCTS_EXCEL_IMPORT_SUCCESS`;
export const PRODUCTS_EXCEL_IMPORT_RESET = `${prefix}/PRODUCTS_EXCEL_IMPORT_RESET`;

export const FETCH_PRODUCTS = `${prefix}/FETCH_PRODUCTS`;
export const FETCH_PRODUCTS_SUCCESS = `${prefix}/FETCH_PRODUCTS_SUCCESS`;

export const FETCH_PRODUCT = `${prefix}/FETCH_PRODUCT`;
export const FETCH_PRODUCT_SUCCESS = `${prefix}/FETCH_PRODUCT_SUCCESS`;
export const CREATE_PRODUCT = `${prefix}/CREATE_PRODUCT`;
export const CREATE_PRODUCT_SUCCESS = `${prefix}/CREATE_PRODUCT_SUCCESS`;

export const SET_PRODUCTS_LOADING = `${prefix}/SET_PRODUCTS_LOADING`;
export const SET_PRODUCTS_EXCEL_IMPORT_LOADING = `${prefix}/SET_PRODUCTS_EXCEL_IMPORT_LOADING`;

/**
 * Reducer
 **/

const ReducerState = {
    products:             [],
    productsExcel:        [],
    importing:            false,
    productsExcelLoading: false,
    productsLoading:      false,
    product:              {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case PRODUCTS_EXCEL_IMPORT_VALIDATE_SUCCESS:
            return { ...state, importing: true, productsExcel: payload };

        case PRODUCTS_EXCEL_IMPORT_RESET:
            return {
                ...state,
                importing:     false,
                productsExcel: ReducerState.productsExcel,
            };

        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, products: payload };

        case SET_PRODUCTS_EXCEL_IMPORT_LOADING:
            return { ...state, productsExcelLoading: payload };

        case SET_PRODUCTS_LOADING:
            return { ...state, productsLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreProducts = state => stateSelector(state).products;
// export const selectStoreProductsExcel = state =>
//     stateSelector(state).productsExcel;
export const selectStoreProductsExcelLoading = state =>
    stateSelector(state).productsExcelLoading;
export const selectProductsLoading = state =>
    stateSelector(state).productsLoading;
export const selectProductsImporting = state => stateSelector(state).importing;

export const selectStoreProductsExcel = createSelector(
    [ stateSelector ],
    ({ productsExcel }) => productsExcel,
);

/**
 * Action Creators
 **/

// products
export const fetchProducts = () => ({
    type: FETCH_PRODUCTS,
});

export const fetchProductsSuccess = products => ({
    type:    FETCH_PRODUCTS_SUCCESS,
    payload: products,
});

// product
export const fetchProduct = () => ({
    type: FETCH_PRODUCT,
});

export const fetchProductSuccess = product => ({
    type:    FETCH_PRODUCT_SUCCESS,
    payload: product,
});

export const createProduct = product => ({
    type:    CREATE_PRODUCT,
    payload: product,
});

export const createProductSuccess = () => ({
    type: CREATE_PRODUCT_SUCCESS,
});

// productsExcel
export const productsExcelImportValidate = file => ({
    type:    PRODUCTS_EXCEL_IMPORT_VALIDATE,
    payload: file,
});

export const productsExcelImportValidateSuccess = payload => ({
    type: PRODUCTS_EXCEL_IMPORT_VALIDATE_SUCCESS,
    payload,
});

export const productsExcelImport = file => ({
    type:    PRODUCTS_EXCEL_IMPORT,
    payload: file,
});

export const productsExcelImportSuccess = payload => ({
    type: PRODUCTS_EXCEL_IMPORT_SUCCESS,
    payload,
});

export const productsExcelImportReset = () => ({
    type: PRODUCTS_EXCEL_IMPORT_RESET,
});

// loaders
export const setProductsExcelImportLoading = isLoading => ({
    type:    SET_PRODUCTS_EXCEL_IMPORT_LOADING,
    payload: isLoading,
});
export const setProductsLoading = isLoading => ({
    type:    SET_PRODUCTS_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

export function* fetchProductsSaga() {
    while (true) {
        try {
            yield take(FETCH_PRODUCTS);
            yield put(setProductsLoading(true));
            const response = yield call(fetchAPI, 'GET', '/store_products');

            yield put(fetchProductsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setProductsLoading(false));
        }
    }
}

export function* createProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_PRODUCT);
            yield put(setProductsLoading(true));
            console.log('* createProductsSaga');
            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products',
                null,
                payload,
            );
            console.log('* createProductsSaga');
            yield put(fetchProductsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setProductsLoading(false));
        }
    }
}

export function* productsExcelImportValidateSaga() {
    while (true) {
        try {
            const { payload: file } = yield take(
                PRODUCTS_EXCEL_IMPORT_VALIDATE,
            );
            yield nprogress.start();
            yield put(setProductsExcelImportLoading(true));
            console.log('* file', file);
            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products/import/validate',
                null,
                file,
            );

            console.log('* response', response);
            yield put(productsExcelImportValidateSuccess(response));
            yield put(setProductsExcelImportLoading(false));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* productsExcelImportSaga() {
    while (true) {
        try {
            const { payload: file } = yield take(PRODUCTS_EXCEL_IMPORT);

            yield nprogress.start();
            yield put(setProductsExcelImportLoading(true));

            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products/import',
                null,
                file,
            );

            yield put(productsExcelImportSuccess(response));
            yield put(setProductsExcelImportLoading(false));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchProductsSaga),
        call(createProductSaga),
        call(productsExcelImportValidateSaga),
        call(productsExcelImportSaga),
    ]);
}
