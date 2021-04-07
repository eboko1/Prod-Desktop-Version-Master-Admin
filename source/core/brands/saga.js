// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchBrands,
    fetchBrandsSuccess,
    FETCH_BRANDS,
} from './duck';

export function* fetchBrandsSaga() {
    while (true) {
        try {
            yield take(FETCH_BRANDS);
            yield nprogress.start();

            const brands = yield call(fetchAPI, 'GET', 'brands');

            yield put(fetchBrandsSuccess(brands));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchBrandsSaga),
    ]);
}
