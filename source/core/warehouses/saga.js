// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchWarehouses,
    fetchWarehousesSuccess,
    FETCH_WAREHOUSES,
} from './duck';

export function* fetchWarehousesSaga() {
    while (true) {
        try {
            yield take(FETCH_WAREHOUSES);
            yield nprogress.start();

            const warehouses = yield call(fetchAPI, 'GET', 'warehouses');

            yield put(fetchWarehousesSuccess(warehouses));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchWarehousesSaga),
    ]);
}
