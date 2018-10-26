// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setBrandsFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchBrands, fetchBrandsSuccess } from './duck';

import { CREATE_BRAND, UPDATE_BRAND, DELETE_BRAND, FETCH_BRANDS } from './duck';

export function* fetchBrandsSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_BRANDS);
            yield put(setBrandsFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `managers/brands/${id}`);

            yield put(fetchBrandsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setBrandsFetchingState(false));
        }
    }
}

export function* updateBrandSaga() {
    while (true) {
        const {
            payload: { packageId, id, entity },
        } = yield take(UPDATE_BRAND);
        const payload = { ...entity, enabled: true };
        yield call(fetchAPI, 'PUT', `managers/brands/${id}`, null, payload);

        yield put(fetchBrands(packageId));
    }
}

export function* createBrandSaga() {
    while (true) {
        const {
            payload: { packageId, entity },
        } = yield take(CREATE_BRAND);
        const payload = { ...entity, enabled: true, packageId };

        yield call(fetchAPI, 'POST', 'managers/brands', null, payload);

        yield put(fetchBrands(packageId));
    }
}

export function* deleteBrandSaga() {
    while (true) {
        const {
            payload: { packageId, id },
        } = yield take(DELETE_BRAND);
        yield call(fetchAPI, 'DELETE', `managers/brands/${id}`);

        yield put(fetchBrands(packageId));
    }
}

export function* saga() {
    yield all([ call(fetchBrandsSaga), call(updateBrandSaga), call(createBrandSaga), call(deleteBrandSaga) ]);
}
