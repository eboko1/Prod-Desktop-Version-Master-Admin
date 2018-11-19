// vendor
import {
    call,
    put,
    all,
    take,
    delay,
    takeLatest,
    takeEvery,
    select,
} from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { setBrandsFetchingState, addError } from 'core/ui/duck';
import { fetchAPI, toDuckError } from 'utils';

// own
import {
    fetchPriorityBrands,
    fetchPriorityBrandsSuccess,
    setSearchSuppliersSuccess,
    setSearchBusinessesSuccess,
    setSearchProductsSuccess,
} from './duck';

import {
    FETCH_PRIORITY_BRANDS,
    SET_SEARCH_SUPPLIERS,
    SET_SEARCH_BUSINESSES,
    SET_SEARCH_PRODUCTS,
    CREATE_PRIORITY_BRAND,
    UPDATE_PRIORITY_BRAND,
    DELETE_PRIORITY_BRAND,
    SET_SORT,
    SET_FILTER,
} from './duck';

export function* setSortSaga() {
    yield put(fetchPriorityBrands());
}
export function* fetchPriorityBrandsSaga() {
    while (true) {
        yield take(FETCH_PRIORITY_BRANDS);
        yield put(setBrandsFetchingState(true));

        const sort = yield select(state => state.forms.brandsForm.sort);
        const filter = yield select(state => state.forms.brandsForm.filter);
        const page = _.get(sort, 'page', 1);
        const sortOrder = _.get(sort, 'order', void 0);
        const sortField = _.get(sort, 'field', void 0);

        const data = yield call(
            fetchAPI,
            'GET',
            '/tecdoc/product/supplier/priorities',
            { page, sortOrder, sortField, ...filter },
        );

        yield put(
            fetchPriorityBrandsSuccess(
                _.chain(data)
                    .values()
                    .first()
                    .value(),
            ),
        );
        yield put(setBrandsFetchingState(false));
    }
}

export function* searchSuppliersSaga({ payload: { id, query } }) {
    yield delay(1000);
    const data = yield call(fetchAPI, 'GET', '/tecdoc/suppliers/search', {
        query,
    });

    yield put(setSearchSuppliersSuccess(id, _.get(data, 'suppliers', [])));
}

export function* searchProductsSaga({ payload: { id, query } }) {
    yield delay(1000);
    const data = yield call(fetchAPI, 'GET', '/tecdoc/products/search', {
        query,
    });

    yield put(setSearchProductsSuccess(id, _.get(data, 'products', [])));
}

export function* searchBusinessesSaga({ payload: { id, query } }) {
    yield delay(1000);
    const data = yield call(fetchAPI, 'GET', '/businesses/search', {
        search: query,
    });

    yield put(setSearchBusinessesSuccess(id, data));
}

export function* deletePriorityBrandSaga({ payload: id }) {
    yield put(setBrandsFetchingState(true));
    yield call(fetchAPI, 'DELETE', `/tecdoc/product/supplier/priorities/${id}`);
    yield put(fetchPriorityBrands());
}

export function* updatePriorityBrandSaga({ payload: { id, entity } }) {
    yield put(setBrandsFetchingState(true));
    try {
        yield call(
            fetchAPI,
            'PUT',
            `/tecdoc/product/supplier/priorities/${id}`,
            void 0,
            entity,
            { handleErrorInternally: true },
        );
    } catch (err) {
        const duckError = toDuckError(err, 'brandsForm');
        yield put(addError(duckError));
    }
    yield put(fetchPriorityBrands());
}

export function* createPriorityBrandSaga({ payload: entity }) {
    yield put(setBrandsFetchingState(true));
    try {
        yield call(
            fetchAPI,
            'POST',
            '/tecdoc/product/supplier/priorities',
            void 0,
            entity,
            { handleErrorInternally: true },
        );
    } catch (err) {
        const duckError = toDuckError(err, 'brandsForm');
        yield put(addError(duckError));
    }
    yield put(fetchPriorityBrands());
}

export function* saga() {
    yield all([ takeEvery([ SET_SORT, SET_FILTER ], setSortSaga), takeEvery(CREATE_PRIORITY_BRAND, createPriorityBrandSaga), takeEvery(UPDATE_PRIORITY_BRAND, updatePriorityBrandSaga), takeEvery(DELETE_PRIORITY_BRAND, deletePriorityBrandSaga), call(fetchPriorityBrandsSaga), takeLatest(SET_SEARCH_SUPPLIERS, searchSuppliersSaga), takeLatest(SET_SEARCH_BUSINESSES, searchBusinessesSaga), takeLatest(SET_SEARCH_PRODUCTS, searchProductsSaga) ]);
}
