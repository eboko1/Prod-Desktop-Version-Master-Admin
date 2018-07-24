// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchAddClientFormSuccess,
    fetchVehiclesInfoSuccess,
    createClientSuccess,

    FETCH_ADD_CLIENT_FORM,
    FETCH_VEHICLES_INFO,
    CREATE_CLIENT
} from './duck';

export function* fetchAddClientFormSaga() {
    while (true) {
        yield take(FETCH_ADD_CLIENT_FORM);

        const data = yield call(fetchAPI, 'GET', 'vehicles_info');
        yield put(fetchAddClientFormSuccess(data));
    }
}

export function* fetchVehiclesInfoSaga() {
    while (true) {
        const {
            payload: { type, filters },
        } = yield take(FETCH_VEHICLES_INFO);

        const data = yield call(fetchAPI, 'GET', 'vehicles_info', filters);
        yield put(fetchVehiclesInfoSuccess(type, data));
    }
}

export function* createClientSaga() {
    while (true) {
        const {
            payload,
        } = yield take(CREATE_CLIENT);

        yield call(fetchAPI, 'POST', 'clients', null, payload);
        yield put(createClientSuccess());
    }
}

export function* saga() {
    yield all([ call(fetchAddClientFormSaga), call(fetchVehiclesInfoSaga), call(createClientSaga) ]);
}
