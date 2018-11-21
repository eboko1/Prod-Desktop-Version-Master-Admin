// vendor
import { call, put, all, take } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { fetchAPI } from 'utils';

// own
import {
    FETCH_DETAILS,
    FETCH_PRODUCT_NAMES,
    SUBMIT_DETAIL_PRODUCT,
    fetchDetails,
    fetchDetailsSuccess,
    fetchProductNamesSuccess,
} from './duck';

export function* submitDetailProductSaga() {
    while (true) {
        const {
            payload: { detailId, productId },
        } = yield take(SUBMIT_DETAIL_PRODUCT);
        yield call(fetchAPI, 'PUT', 'tecdoc/products/set', void 0, {
            detailId,
            productId,
        });

        yield put(fetchDetails());
    }
}

export function* fetchDetailsSaga() {
    while (true) {
        yield take(FETCH_DETAILS);
        const data = yield call(fetchAPI, 'GET', 'tecdoc/products/all');

        yield put(fetchDetailsSuccess(data));
    }
}

export function* fetchProductNamesSaga() {
    while (true) {
        const {
            payload: { articleNumber, supplierId },
        } = yield take(FETCH_PRODUCT_NAMES);
        const products = yield call(fetchAPI, 'GET', 'tecdoc/products/names', {
            articleNumber,
            supplierId,
        });

        yield put(fetchProductNamesSuccess(products));
    }
}

export function* saga() {
    yield all([ call(fetchProductNamesSaga), call(fetchDetailsSaga), call(submitDetailProductSaga) ]);
}
