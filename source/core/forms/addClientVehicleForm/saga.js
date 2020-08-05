// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import { fetchVehiclesInfoSuccess } from './duck';

import { FETCH_VEHICLES_INFO } from './duck';

export function* fetchVehiclesInfoSaga() {
    while (true) {
        const {
            payload: { type, filters },
        } = yield take(FETCH_VEHICLES_INFO);
        const data = yield call(fetchAPI, 'GET', 'vehicles_info', filters);
        yield put(fetchVehiclesInfoSuccess(type, data));
    }
}

export function* saga() {
    yield all([ call(fetchVehiclesInfoSaga) ]);
}
