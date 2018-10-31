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
            yield take(FETCH_SERVICES);
            yield put(setServicesFetchingState(true));

            const data = yield call(
                fetchAPI,
                'GET',
                'services/parts/suggestions',
                // filters,
            );

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
            payload: { id, suggestion },
        } = yield take(UPDATE_SERVICE);
        yield call(
            fetchAPI,
            'GET',
            `services/parts/suggestions${id}`,
            // filters,
            null,
            suggestion,
        );

        yield put(fetchServices());
    }
}

export function* createServiceSaga() {
    while (true) {
        const { payload: suggestion } = yield take(CREATE_SERVICE);
        console.log('* createServiceSaga', suggestion);
        yield call(
            fetchAPI,
            'POST',
            'services/parts/suggestions',
            null,
            suggestion,
        );

        yield put(fetchServices());
    }
}

export function* deleteServiceSaga() {
    while (true) {
        const { payload: id } = yield take(DELETE_SERVICE);
        yield call(fetchAPI, 'DELETE', `services/parts/suggestions/${id}`);

        yield put(fetchServices());
    }
}

export function* saga() {
    yield all([ call(fetchServicesSaga), call(updateServiceSaga), call(createServiceSaga), call(deleteServiceSaga) ]);
}
