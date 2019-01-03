// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchSuppliers,
    fetchSuppliersSuccess,
    FETCH_SUPPLIERS,
    CREATE_SUPPLIER,
    DELETE_SUPPLIER,
} from './duck';

export function* fetchSuppliersSaga() {
    while (true) {
        try {
            yield take(FETCH_SUPPLIERS);
            yield nprogress.start();

            const data = yield call(fetchAPI, 'GET', 'business_suppliers');

            yield put(fetchSuppliersSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* createSupplierSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_SUPPLIER);
            yield nprogress.start();

            payload.id
                ? yield call(
                    fetchAPI,
                    'PUT',
                    `business_suppliers/${payload.id}`,
                    null,
                    _.omit(payload, 'id'),
                )
                : yield call(
                    fetchAPI,
                    'POST',
                    'business_suppliers',
                    null,
                    payload,
                );

            yield put(fetchSuppliers());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}
export function* deleteSupplierSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(DELETE_SUPPLIER);
            yield nprogress.start();

            yield call(fetchAPI, 'DELETE', `business_suppliers/${id}`);

            yield put(fetchSuppliers());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(fetchSuppliersSaga), call(createSupplierSaga), call(deleteSupplierSaga) ]);
}
