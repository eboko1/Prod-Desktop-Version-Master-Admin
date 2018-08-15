// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchAddClientFormSuccess,
    fetchVehiclesInfoSuccess,
    createClientSuccess,
    FETCH_ADD_CLIENT_FORM,
    FETCH_VEHICLES_INFO,
    CREATE_CLIENT,
} from './duck';

export function* fetchAddClientFormSaga() {
    while (true) {
        try {
            yield take(FETCH_ADD_CLIENT_FORM);
            const data = yield call(fetchAPI, 'GET', 'vehicles_info');

            yield put(fetchAddClientFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchVehiclesInfoSaga() {
    while (true) {
        try {
            const {
                payload: { type, filters },
            } = yield take(FETCH_VEHICLES_INFO);

            const data = yield call(fetchAPI, 'GET', 'vehicles_info', filters);
            yield put(fetchVehiclesInfoSuccess(type, data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createClientSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_CLIENT);

            yield call(fetchAPI, 'POST', 'clients', null, payload);
            yield put(createClientSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        call(fetchAddClientFormSaga),
        call(fetchVehiclesInfoSaga),
        call(createClientSaga),
    ]);
}
/* eslint-enable array-element-newline */
