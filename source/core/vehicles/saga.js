// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchVehicleSuccess,
    fetchVehiclesSuccess,
    selectSort,
    selectFilters,

    FETCH_VEHICLE,
    FETCH_VEHICLES,
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        try {
            const { payload: {vehicleId} } = yield take(FETCH_VEHICLE);

            yield nprogress.start();

            const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);

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

export function* fetchVehiclesSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLES);

            const sort = yield select(selectSort);
            const filters = yield select(selectFilters);

            yield nprogress.start();

            const {clientsVehicles, clientsVehiclesStats} = yield call(fetchAPI, 'GET', `vehicles`, {sort, filters});

            yield put(fetchVehiclesSuccess({vehicles: clientsVehicles, stats: clientsVehiclesStats}));
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
        call(fetchVehiclesSaga),
    ]);
}
