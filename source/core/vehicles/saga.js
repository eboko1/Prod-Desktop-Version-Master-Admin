// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchVehicleSuccess,
    FETCH_VEHICLE,
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE);
            console.log("Here we are!");
            yield nprogress.start();

            const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${143957}`); //Replace here later

            yield put(fetchVehicleSuccess({vehicle}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchVehicleSaga),
    ]);
}
