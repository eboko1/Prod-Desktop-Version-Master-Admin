// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setServicesFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchServices, fetchServicesSuccess } from './duck';

import {
    CREATE_SERVICE,
    UPDATE_SERVICE,
    DELETE_SERVICE,
    FETCH_SERVICES,
} from './duck';

export function* fetchServicesSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_SERVICES);
            yield put(setServicesFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `managers/services/${id}`);

            yield put(fetchServicesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setServicesFetchingState(false));
        }
    }
}

export function* updateServiceSaga() {
    while (true) {
        const {
            payload: { packageId, id, entity },
        } = yield take(UPDATE_SERVICE);
        const payload = { ...entity, enabled: true };
        yield call(fetchAPI, 'PUT', `managers/services/${id}`, null, payload);

        yield put(fetchServices(packageId));
    }
}

export function* createServiceSaga() {
    while (true) {
        const {
            payload: { packageId, entity },
        } = yield take(CREATE_SERVICE);
        const payload = { ...entity, enabled: true, packageId };

        yield call(fetchAPI, 'POST', 'managers/services', null, payload);

        yield put(fetchServices(packageId));
    }
}

export function* deleteServiceSaga() {
    while (true) {
        const {
            payload: { packageId, id },
        } = yield take(DELETE_SERVICE);
        yield call(fetchAPI, 'DELETE', `managers/services/${id}`);

        yield put(fetchServices(packageId));
    }
}

export function* saga() {
    yield all([ call(fetchServicesSaga), call(updateServiceSaga), call(createServiceSaga), call(deleteServiceSaga) ]);
}
