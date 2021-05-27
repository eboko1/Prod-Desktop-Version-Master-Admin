// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    setVehicleVin,
    setVehicleNumber,
    setVehicleYear,
    setVehicleMakeId,
    setVehicleModelId,
    setVehicleModificationId,
    setFetchingAllVehicleData,

    selectFields,
   
    fetchVehicleSuccess,
    fetchVehicleYearsSuccess,
    fetchVehicleMakesSuccess,
    fetchVehicleModelsSuccess,
    fetchVehicleModificationsSuccess
} from './duck';

import {
    CREATE_VEHICLE,
    UPDATE_VEHICLE,
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

/**
 * This saga is used to initialize all vehicle data and setup all fields.
 * For example: it fetches vehicle, takes its values and puts them intu "fields" object vie setters,
 * then it fetches all data for vehicle of that type, yer, model etc.(models, makes, modifications)
 */
export function* fetchAllVehicleDataSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(FETCH_ALL_VEHICLE_DATA);
        yield put(setFetchingAllVehicleData(true));

        const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);
        yield put(fetchVehicleSuccess({vehicle}));

        const {
            vehicleNumber: number,
            vehicleVin: vin,
            year,
            makeId,
            vehicleModelId: modelId,
            vehicleModificationId: modificationId,
        } = vehicle;

        yield put(setVehicleNumber({number}));
        yield put(setVehicleVin({vin}));
        yield put(setVehicleMakeId({makeId}));
        yield put(setVehicleYear({year}));
        yield put(setVehicleMakeId({makeId}));
        yield put(setVehicleModelId({modelId}));
        yield put(setVehicleModificationId({modificationId}));
        
        const { years } = yield call(fetchAPI, 'GET', 'vehicles_info');
        yield put(fetchVehicleYearsSuccess({years}));

        const { makes } = yield call(fetchAPI, 'GET', 'vehicles_info', {year});
        yield put(fetchVehicleMakesSuccess({makes}));

        const {models} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId});
        yield put(fetchVehicleModelsSuccess({models}));

        const {modifications} = yield call(fetchAPI, 'GET', 'vehicles_info', {year, makeId, modelId});
        yield put(fetchVehicleModificationsSuccess({modifications}));

        yield put(setFetchingAllVehicleData(false));
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
        } = yield select(selectFields);

        const payload = {
            vehicleModelId,
            vehicleModificationId,
            vehicleVin,
            vehicleNumber,
            vehicleYear,
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

export function* updateVehicleSaga() {
    while (true) {
        const { payload: { vehicleId } } = yield take(UPDATE_VEHICLE);

        const {
            number,
            vin,
            year,
            makeId,//This is not needed as it is fetched from modificationId by default
            modelId,
            modificationId,
        } = yield select(selectFields);

        const payload = {
            vehicleNumber: number,
            vehicleVin: vin,
            vehicleYear: year,
            vehicleModelId: modelId,
            vehicleModificationId: modificationId,
        };

        console.log("payload: ", payload);

        yield call(
            fetchAPI,
            'PUT',
            `clients/vehicles/${vehicleId}`,
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
        call(updateVehicleSaga),
    ]);
}
