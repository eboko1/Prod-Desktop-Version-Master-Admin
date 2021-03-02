// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchVehicleTypesSuccess,
    FETCH_VEHICLE_TYPES,
} from './duck';

export function* fetchVehicleTypesSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_TYPES);
            yield nprogress.start();

            const vehicleTypes = yield call(fetchAPI, 'GET', 'vehicle_types');

            yield put(fetchVehicleTypesSuccess(vehicleTypes));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchVehicleTypesSaga),
    ]);
}
