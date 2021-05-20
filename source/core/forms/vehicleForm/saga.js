// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchVehicleSuccess
} from './duck';

import {
    FETCH_VEHICLE
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(FETCH_VEHICLE);
        const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);
        yield put(fetchVehicleSuccess({vehicle}));
    }
}

// export function* fetchVehiclesInfoSaga() {
//     while (true) {
//         const {
//             payload: { type, filters },
//         } = yield take(FETCH_VEHICLES_INFO);
//         const data = yield call(fetchAPI, 'GET', 'vehicles_info', filters);
//         yield put(fetchVehiclesInfoSuccess(type, data));
//     }
// }

export function* saga() {
    yield all([
        call(fetchVehicleSaga)
    ]);
}
