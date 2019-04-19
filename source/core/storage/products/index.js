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
export const UPDATE_PRODUCT = `${prefix}/UPDATE_PRODUCT`;
export const UPDATE_PRODUCT_SUCCESS = `${prefix}/UPDATE_PRODUCT_SUCCESS`;
export const DELETE_PRODUCT = `${prefix}/DELETE_PRODUCT`;
export const DELETE_PRODUCT_SUCCESS = `${prefix}/DELETE_PRODUCT_SUCCESS`;

export const SET_PRODUCT_LOADING = `${prefix}/SET_PRODUCT_LOADING`;
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

        case FETCH_PRODUCT_SUCCESS:
            return { ...state, product: payload };

        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, products: payload };

        case SET_PRODUCTS_EXCEL_IMPORT_LOADING:
            return { ...state, productsExcelLoading: payload };

        case SET_PRODUCT_LOADING:
            return { ...state, productLoading: payload };

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
export const selectStoreProduct = state => stateSelector(state).product;
export const selectStoreProducts = state => stateSelector(state).products;
// export const selectStoreProductsExcel = state =>
//     stateSelector(state).productsExcel;
export const selectStoreProductsExcelLoading = state =>
    stateSelector(state).productsExcelLoading;
export const selectProductLoading = state =>
    stateSelector(state).productLoading;
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
export const fetchProduct = id => ({
    type:    FETCH_PRODUCT,
    payload: id,
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

export const updateProduct = product => ({
    type:    UPDATE_PRODUCT,
    payload: product,
});

export const updateProductSuccess = () => ({
    type: UPDATE_PRODUCT_SUCCESS,
});

export const deleteProduct = product => ({
    type:    DELETE_PRODUCT,
    payload: product,
});

export const deleteProductSuccess = () => ({
    type: DELETE_PRODUCT_SUCCESS,
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

export const setProductLoading = isLoading => ({
    type:    SET_PRODUCT_LOADING,
    payload: isLoading,
});

export const setProductsLoading = isLoading => ({
    type:    SET_PRODUCTS_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

const normalizeFile = file =>
    file.map(product => {
        return {
            code:             String(product.code),
            name:             String(product.name),
            groupId:          Number(product.groupId),
            groupName:        String(product.groupName),
            brandId:          Number(product.brandId),
            brandName:        String(product.brandName),
            measureUnit:      String(product.measureUnit),
            tradeCode:        String(product.tradeCode),
            certificate:      String(product.certificate),
            priceGroupNumber: Number(product.priceGroupNumber),
            price:            Number(product.price),
        };
    });

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

export function* fetchProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_PRODUCT);
            yield put(setProductLoading(true));
            const response = yield call(
                fetchAPI,
                'GET',
                `/store_products/${payload}`,
            );

            yield put(fetchProductSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setProductLoading(false));
        }
    }
}

export function* createProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_PRODUCT);
            yield put(setProductsLoading(true));
            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products',
                null,
                payload,
            );
            yield put(fetchProductsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setProductsLoading(false));
        }
    }
}
export function* updateProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(UPDATE_PRODUCT);
            yield call(
                fetchAPI,
                'PUT',
                `/store_products${payload.id}`,
                null,
                payload,
            );
            yield put(updateProductSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* deleteProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(DELETE_PRODUCT);
            yield call(fetchAPI, 'DELETE', `/store_products/${payload}`);
            yield put(deleteProductSuccess());
        } catch (error) {
            yield put(emitError(error));
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
            const normalizedFile = normalizeFile(file);

            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products/import/validate',
                null,
                normalizedFile,
            );

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

            // const normalizedFile = normalizeFile(file);

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
        call(fetchProductSaga),
        call(fetchProductsSaga),
        call(createProductSaga),
        call(updateProductSaga),
        call(deleteProductSaga),
        call(productsExcelImportValidateSaga),
        call(productsExcelImportSaga),
    ]);
}
