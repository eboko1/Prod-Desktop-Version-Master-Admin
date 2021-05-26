// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
    setFetchingAllVehicleData,

    selectFields,
    selectVehicle,

    fetchVehicle,
    fetchVehicleYears,
    fetchVehicleMakes,
    fetchVehicleModels,
    fetchVehicleModifications,
    fetchVehicleSuccess,
    fetchVehicleYearsSuccess,
    fetchVehicleMakesSuccess,
    fetchVehicleModelsSuccess,
    fetchVehicleModificationsSuccess
} from './duck';

import {
    CREATE_VEHICLE,
    FETCH_VEHICLE,
    FETCH_VEHICLE_YEARS,
    FETCH_VEHICLE_MAKES,
    FETCH_VEHICLE_MODELS,
    FETCH_VEHICLE_MODIFICATIONS,
    FETCH_ALL_VEHICLE_DATA,
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(FETCH_VEHICLE);
        const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);
        yield put(fetchVehicleSuccess({vehicle}));
    }
}

export function* fetchAllVehicleDataSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(FETCH_ALL_VEHICLE_DATA);
        yield put(setFetchingAllVehicleData(true));
        // yield put(fetchVehicle({vehicleId}));

        console.log("Before selecting vehicle");

        const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);
        yield put(fetchVehicleSuccess({vehicle}));

        console.log("Fetched vehicle in saga: ", vehicle);

        const {
            year,
            makeId,
            vehicleModelId: modelId,
            vehicleModificationId: modificationId,
        } = vehicle;

        // fetchVehicleYears,
        // fetchVehicleMakes,
        // fetchVehicleModels,
        // fetchVehicleModifications,
        // yield put(fetchVehicleYears());
        yield put(setVehicleYear({year}));
        yield put(setVehicleMakeId({makeId}));
        yield put(setVehicleModelId({modelId}));
        yield put(setVehicleModificationId({modificationId}));
        
        yield put(setFetchingAllVehicleData(false));

        const { years } = yield call(fetchAPI, 'GET', 'vehicles_info');
        yield put(fetchVehicleYearsSuccess({years}));

        // const { year } = yield select(selectFields);
        const { makes } = yield call(fetchAPI, 'GET', 'vehicles_info', {year});
        yield put(fetchVehicleMakesSuccess({makes}));

        // const { year, makeId } = yield select(selectFields);
        const {models} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId});
        yield put(fetchVehicleModelsSuccess({models}));

        // const { year, makeId, modelId } = yield select(selectFields);
        const {modifications} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId, modelId});
        yield put(fetchVehicleModificationsSuccess({modifications}));

        // yield put(fetchVehicleMakes());
        // yield put(fetchVehicleModels());
        // yield put(fetchVehicleModifications());
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

export function* createVehicleSaga() {
    while (true) {
        yield take(CREATE_VEHICLE);

        const {
            clientId,
            modificationId: vehicleModificationId,
            number: vehicleNumber,
            vin: vehicleVin,
            modelId: vehicleModelId,
            year: vehicleYear,
            // vehicleTypeId: vehicleTypeId,
            // wheelRadius: wheelRadius,
        } = yield select(selectFields);

        const payload = {
            vehicleModelId,
            vehicleModificationId,
            vehicleVin,
            vehicleNumber,
            vehicleYear,
            // vehicleTypeId,
            // wheelRadius,
        };

        yield call(
            fetchAPI,
            'POST',
            `clients/${clientId}/vehicles`,
            null,
            payload,
        );
    }
}

export function* saga() {
    yield all([
        call(fetchVehicleSaga),
        call(fetchAllVehicleDataSaga),
        call(fetchVehiclesYearsSaga),
        call(fetchVehiclesMakesSaga),
        call(fetchVehiclesModelsSaga),
        call(fetchVehiclesModificationsSaga),
        call(createVehicleSaga),
    ]);
}
