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
            const { payload: {vehicleId} } = yield take(FETCH_VEHICLE);

            yield nprogress.start();

            const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`); //Replace here later

            const {
                clientId
            } = vehicle;

            const client = yield call(fetchAPI, 'GET', `clients/${clientId}`);

            const generalData = yield call(fetchAPI, 'GET', `order_latest_info`, {vehicleId: vehicleId});

            yield put(fetchVehicleSuccess({vehicle, client, generalData}));
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
