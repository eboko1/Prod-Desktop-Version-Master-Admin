// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import { fetchVehicleNumberHistorySuccess } from './duck';

import { FETCH_VEHICLE_NUMBER_HISTORY } from './duck';

export function* fetchVehicleNumberHistorySaga() {
    while (true) {
        const { payload: number } = yield take(FETCH_VEHICLE_NUMBER_HISTORY);

        const data = yield call(fetchAPI, 'GET', 'vehicle/number/history', {
            number,
        });
        yield put(fetchVehicleNumberHistorySuccess(data));
    }
}

export function* saga() {
    yield all([ call(fetchVehicleNumberHistorySaga) ]);
}
