// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { createSelector } from 'reselect';
import _ from 'lodash';

//proj
import { setErrorMessage } from 'core/errorMessage/duck';
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

export const FETCH_AVAILABLE_PRODUCTS = `${prefix}/FETCH_AVAILABLE_PRODUCTS`;
export const FETCH_AVAILABLE_PRODUCTS_SUCCESS = `${prefix}/FETCH_AVAILABLE_PRODUCTS_SUCCESS`;

export const FETCH_RECOMMENDED_PRICE = `${prefix}/FETCH_RECOMMENDED_PRICE`;
export const FETCH_RECOMMENDED_PRICE_SUCCESS = `${prefix}/FETCH_RECOMMENDED_PRICE_SUCCESS`;

export const FETCH_PRODUCT = `${prefix}/FETCH_PRODUCT`;
export const FETCH_PRODUCT_SUCCESS = `${prefix}/FETCH_PRODUCT_SUCCESS`;

export const CREATE_PRODUCT = `${prefix}/CREATE_PRODUCT`;
export const CREATE_PRODUCT_SUCCESS = `${prefix}/CREATE_PRODUCT_SUCCESS`;
export const UPDATE_PRODUCT = `${prefix}/UPDATE_PRODUCT`;
export const UPDATE_PRODUCT_SUCCESS = `${prefix}/UPDATE_PRODUCT_SUCCESS`;
export const DELETE_PRODUCT = `${prefix}/DELETE_PRODUCT`;
export const DELETE_PRODUCT_SUCCESS = `${prefix}/DELETE_PRODUCT_SUCCESS`;

export const SET_STORE_PRODUCTS_PAGE = `${prefix}/SET_STORE_PRODUCTS_PAGE`;

export const SET_PRODUCT_LOADING = `${prefix}/SET_PRODUCT_LOADING`;
export const SET_PRODUCTS_LOADING = `${prefix}/SET_PRODUCTS_LOADING`;
export const SET_RECOMMENDED_PRICE_LOADING = `${prefix}/SET_RECOMMENDED_PRICE_LOADING`;
export const SET_PRODUCTS_EXCEL_IMPORT_LOADING = `${prefix}/SET_PRODUCTS_EXCEL_IMPORT_LOADING`;

/**
 * Reducer
 **/

const ReducerState = {
    products: {
        stats: {
            count: '0',
        },
        list: [],
    },
    availableProducts: {},
    productsExcel:     {
        validProducts:          [],
        tooManyInvalidProducts: false,
        invalidProducts:        [],
    },
    validationError:         false,
    importing:               false,
    productsExcelLoading:    false,
    productsLoading:         false,
    recommendedPriceLoading: false,
    product:                 {},
    filters:                 {
        page: 1,
    },
};

/* eslint-disable complexity */
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case PRODUCTS_EXCEL_IMPORT_VALIDATE_SUCCESS:
            return { ...state, importing: true, productsExcel: payload };

        case PRODUCTS_EXCEL_IMPORT_SUCCESS:
            return {
                ...state,
                // importing:       !_.isEmpty(payload.invalidProducts),
                productsExcel:   payload,
                validationError: !_.isEmpty(payload.invalidProducts),
            };

        case PRODUCTS_EXCEL_IMPORT_RESET:
            return {
                ...state,
                importing:     false,
                productsExcel: ReducerState.productsExcel,
            };

        case FETCH_PRODUCT_SUCCESS:
            return { ...state, product: { ...payload } };

        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, products: { ...payload } };

        // DEPRECATED
        // case FETCH_AVAILABLE_PRODUCTS_SUCCESS:
        //     return {
        //         ...state,
        //         availableProducts: {
        //             key:   payload.key,
        //             using: { ...payload.availableProducts },
        //         },
        //     };
        case FETCH_RECOMMENDED_PRICE_SUCCESS:
            return {
                ...state,
                recommendedPrice: { ...payload },
            };

        case SET_STORE_PRODUCTS_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_PRODUCTS_EXCEL_IMPORT_LOADING:
            return { ...state, productsExcelLoading: payload };

        case SET_PRODUCT_LOADING:
            return { ...state, productLoading: payload };

        case SET_PRODUCTS_LOADING:
            return { ...state, productsLoading: payload };

        case SET_RECOMMENDED_PRICE_LOADING:
            return { ...state, recommendedPriceLoading: payload };

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
export const selectRecommendedPrice = state =>
    stateSelector(state).selectRecommendedPrice;
export const selectStoreProductsFilters = state => stateSelector(state).filters;
// export const selectStoreProductsExcel = state =>
//     stateSelector(state).productsExcel;
export const selectStoreProductsExcelLoading = state =>
    stateSelector(state).productsExcelLoading;
export const selectProductLoading = state =>
    stateSelector(state).productLoading;
export const selectProductsLoading = state =>
    stateSelector(state).productsLoading;
export const selectRecommendedPriceLoading = state =>
    stateSelector(state).selectRecommendedPriceLoading;

export const selectProductsImporting = state => stateSelector(state).importing;

export const selectImportValidProducts = state =>
    stateSelector(state).productsExcel.validProducts;
export const selectImportValidationError = state =>
    stateSelector(state).validationError;
export const selectImportInvalidProducts = state =>
    stateSelector(state).productsExcel.invalidProducts;
export const selectImportTooManyInvalids = state =>
    stateSelector(state).productsExcel.tooManyInvalidProducts;

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

export const setStoreProductsPage = page => ({
    type:    SET_STORE_PRODUCTS_PAGE,
    payload: page,
});

// available products DEPRECATED!
export const fetchAvailableProducts = (key, id, count) => ({
    type:    FETCH_AVAILABLE_PRODUCTS,
    payload: { key, id, count },
});

export const fetchAvailableProductsSuccess = (key, availableProducts) => ({
    type:    FETCH_AVAILABLE_PRODUCTS_SUCCESS,
    payload: { key, availableProducts },
});

//
export const fetchRecommendedPrice = (key, id) => ({
    type:    FETCH_RECOMMENDED_PRICE,
    payload: { key, id },
});

export const fetchRecommendedPriceSuccess = recommendedPrice => ({
    type:    FETCH_RECOMMENDED_PRICE_SUCCESS,
    payload: recommendedPrice,
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

export const setRecommendedPriceLoading = isLoading => ({
    type:    SET_RECOMMENDED_PRICE_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

const normalizeFile = file =>
    file.map(product => {
        return {
            code:        product.code ? String(product.code) : void 0,
            name:        product.name ? String(product.name) : void 0,
            groupId:     product.groupId ? Number(product.groupId) : void 0,
            groupName:   product.groupName ? String(product.groupName) : void 0,
            brandId:     product.brandId ? Number(product.brandId) : void 0,
            brandName:   product.brandName ? String(product.brandName) : void 0,
            measureUnit: product.measureUnit
                ? String(product.measureUnit)
                : void 0,
            tradeCode:   product.tradeCode ? String(product.tradeCode) : void 0,
            certificate: product.certificate
                ? String(product.certificate)
                : void 0,
            priceGroupNumber: product.priceGroupNumber
                ? Number(product.priceGroupNumber)
                : void 0,
            price: product.price ? Number(product.price) : void 0,
        };
    });

export function* fetchProductsSaga() {
    while (true) {
        try {
            yield take(FETCH_PRODUCTS);
            yield put(setProductsLoading(true));
            const filters = yield select(selectStoreProductsFilters);
            const response = yield call(
                fetchAPI,
                'GET',
                '/store_products',
                filters,
            );

            yield put(fetchProductsSuccess(response));
        } catch (error) {
            yield put(setErrorMessage(error));
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
            yield put(setErrorMessage(error));
        } finally {
            yield put(setProductLoading(false));
        }
    }
}

// DEPRECATED
// export function* fetchAvailableProductsSaga() {
//     while (true) {
//         try {
//             const {
//                 payload: { key, id, count },
//             } = yield take(FETCH_AVAILABLE_PRODUCTS);
//             yield put(setAvailableProductsLoading(true));

//             const response = yield call(
//                 fetchAPI,
//                 'GET',
//                 '/store_doc_products/available/',
//                 {
//                     productId:      id,
//                     neededQuantity: count || 1,
//                 },
//             );

//             yield put(fetchAvailableProductsSuccess(key, response));
//         } catch (error) {
//             yield put(emitError(error));
//         } finally {
//             yield put(setAvailableProductsLoading(false));
//         }
//     }
// }
export function* fetchRecommendedPriceSaga() {
    while (true) {
        try {
            const {
                payload: { key, id },
            } = yield take(FETCH_RECOMMENDED_PRICE);
            yield put(setRecommendedPriceLoading(true));

            const response = yield call(
                fetchAPI,
                'GET',
                `/store_doc_products/${id}/recommended_price`,
                null,
                null,
                {
                    handleErrorInternally: true,
                },
            );

            yield put(fetchRecommendedPriceSuccess({ key, ...response }));
        } catch (error) {
            yield put(setErrorMessage(error));
        } finally {
            yield put(setRecommendedPriceLoading(false));
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
                {
                    handleErrorInternally: true,
                },
            );
            yield put(fetchProductsSuccess(response));
        } catch (error) {
            // TODO: fifnish error toast handling
            yield put(setErrorMessage(error));
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
                `/store_products/${payload.id}`,
                null,
                payload.product,
                {
                    handleErrorInternally: true,
                },
            );
            yield put(updateProductSuccess());
        } catch (error) {
            yield put(setErrorMessage(error));
        }
    }
}
export function* deleteProductSaga() {
    while (true) {
        try {
            const { payload } = yield take(DELETE_PRODUCT);
            yield call(
                fetchAPI,
                'DELETE',
                `/store_products/${payload}`,
                null,
                null,
                {
                    handleErrorInternally: true,
                },
            );
            yield put(deleteProductSuccess());
        } catch (error) {
            yield put(setErrorMessage(error));
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
                {
                    handleErrorInternally: true,
                },
            );

            yield put(productsExcelImportValidateSuccess(response));
            yield put(setProductsExcelImportLoading(false));
        } catch (error) {
            yield put(setErrorMessage(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* productsExcelImportSaga() {
    while (true) {
        try {
            // file = invalid
            const { payload: file } = yield take(PRODUCTS_EXCEL_IMPORT);

            yield nprogress.start();
            yield put(setProductsExcelImportLoading(true));
            const valid = yield select(selectImportValidProducts);

            const normalizedFile = normalizeFile(file);

            const validationResult = yield call(
                fetchAPI,
                'POST',
                '/store_products/import/validate',
                null,
                normalizedFile,
                {
                    handleErrorInternally: true,
                },
            );
            console.log('**SAGA validationResult', validationResult);

            const response = yield call(
                fetchAPI,
                'POST',
                '/store_products/import',
                null,
                valid.concat(validationResult.validProducts),
                {
                    handleErrorInternally: true,
                },
            );

            console.log('→ ** SAGA response', response);

            yield put(productsExcelImportSuccess(validationResult));
            yield put(setProductsExcelImportLoading(false));

            // if(!_.isEmpty(validationResult.invalidProducts)) {
            //     yield put(productsExcelImportReset());
            // }
        } catch (error) {
            yield put(setErrorMessage(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchProductSaga),
        call(fetchProductsSaga),
        // call(fetchAvailableProductsSaga),
        call(fetchRecommendedPriceSaga),
        call(createProductSaga),
        call(updateProductSaga),
        call(deleteProductSaga),
        call(productsExcelImportValidateSaga),
        call(productsExcelImportSaga),
    ]);
}
