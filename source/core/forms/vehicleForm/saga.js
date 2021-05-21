// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    selectFields,

    fetchVehicleSuccess,
    fetchVehicleYearsSuccess,
    fetchVehicleMakesSuccess,
    fetchVehicleModelsSuccess,
    fetchVehicleModificationsSuccess
} from './duck';

import {
    FETCH_VEHICLE,
    FETCH_VEHICLE_YEARS,
    FETCH_VEHICLE_MAKES,
    FETCH_VEHICLE_MODELS,
    FETCH_VEHICLE_MODIFICATIONS,
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(FETCH_VEHICLE);
        const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);
        yield put(fetchVehicleSuccess({vehicle}));
    }
}

export function* fetchVehiclesYearsSaga() {
    while (true) {
        yield take(FETCH_VEHICLE_YEARS);
        const { years } = yield call(fetchAPI, 'GET', 'vehicles_info');
        yield put(fetchVehicleYearsSuccess({years}));
    }
}

export function* fetchVehiclesMakesSaga() {
    while (true) {
        yield take(FETCH_VEHICLE_MAKES);

        const { year } = yield select(selectFields);

        const { makes } = yield call(fetchAPI, 'GET', 'vehicles_info', {year});
        yield put(fetchVehicleMakesSuccess({makes}));
    }
}

export function* fetchVehiclesModelsSaga() {
    while (true) {
        yield take(FETCH_VEHICLE_MODELS);

        const { year, makeId } = yield select(selectFields);
        
        const {models} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId});
        yield put(fetchVehicleModelsSuccess({models}));
    }
}

export function* fetchVehiclesModificationsSaga() {
    while (true) {
        yield take(FETCH_VEHICLE_MODIFICATIONS);

        const { year, makeId, modelId } = yield select(selectFields);
        
        const {modifications} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId, modelId});
        yield put(fetchVehicleModificationsSuccess({modifications}));
    }
}
export function* saga() {
    yield all([
        call(fetchVehicleSaga),
        call(fetchVehiclesYearsSaga),
        call(fetchVehiclesMakesSaga),
        call(fetchVehiclesModelsSaga),
        call(fetchVehiclesModificationsSaga),
    ]);
}
