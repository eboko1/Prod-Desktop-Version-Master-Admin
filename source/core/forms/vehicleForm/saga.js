// vendor
import { notification } from 'antd';
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

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
    setFetchingClients,

    selectFields,
    selectClientsFilters,
    selectClientsSort,

    fetchVehicleSuccess,
    fetchClientsSuccess,
    fetchVehicleYearsSuccess,
    fetchVehicleMakesSuccess,
    fetchVehicleModelsSuccess,
    fetchVehicleModificationsSuccess, FETCH_VEHICLE_DATA_BY_VIN,
} from './duck';

import {
    FETCH_CLIENTS,
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

/**
 * This saga is used to fetch data about vehicle by vin
 * it automatically set up fields and fetches data model, modifications, years, etc
 */
export function* fetchVehicleDataByVinSaga() {
    while (true) {
        yield take(FETCH_VEHICLE_DATA_BY_VIN);

        let { vin } = yield select(selectFields);

        vin = String(vin).trim();

        const { brand, name: carModel, manufacturedYear } = yield call(fetchAPI, 'GET', `vin/get_list_vehicle_attributes`, {vin: vin});

        console.log("S: ", brand, carModel, manufacturedYear )

        if (manufacturedYear && manufacturedYear.length == 4) {
            yield put(setVehicleYear({ year: manufacturedYear}));

            console.log("Year: ", manufacturedYear);

            const { years } = yield call(fetchAPI, 'GET', 'vehicles_info');
            yield put(fetchVehicleYearsSuccess({ years }));

            console.log("Years: ", years)


            if (brand && String(brand).length > 0) {
                const { makes } = yield call(fetchAPI, 'GET', 'vehicles_info', { year: manufacturedYear });
                yield put(fetchVehicleMakesSuccess({ makes }));

                console.log("Makes: ", makes)

                const filteredMakes = _.filter(makes, (make) => {
                    const makeName = String(make.name).toLowerCase();
                    const brandName = String(brand);

                    return makeName.includes(brandName.toLowerCase()) || brandName.includes(makeName.toLowerCase());
                });

                const firstMakeId = _.get(filteredMakes, '[0].id');

                console.log("F: ", firstMakeId)

                if (firstMakeId) {
                    yield put(setVehicleMakeId({ makeId: firstMakeId }));
                    if (String(carModel).length > 0) {

                        const {models} = yield call(fetchAPI, 'GET', 'vehicles_info', {year: manufacturedYear, makeId: firstMakeId});
                        yield put(fetchVehicleModelsSuccess({models}));

                        console.log("M: ", models)

                        const filteredModels = _.filter(models, (model) => {
                            const modelName = String(model.name).toLowerCase();
                            const carModelName = String(carModel);

                            return modelName.includes(carModelName.toLowerCase()) || carModelName.includes(modelName.toLowerCase());
                        });

                        const firstModelId = _.get(filteredModels, '[0].id');

                        console.log("FMID: ", firstMakeId)

                        if (firstModelId) {
                            yield put(setVehicleModelId({ modelId: firstModelId }));

                            const { modifications } = yield call(fetchAPI, 'GET', 'vehicles_info', {year: manufacturedYear, makeId: firstMakeId, modelId: firstModelId});

                            yield put(fetchVehicleModificationsSuccess({modifications}));
                        }
                    }
                }
            }
        }
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
            clientId,
            number,
            vin,
            year,
            makeId,//This is not needed as it is fetched from modificationId by default
            modelId,
            modificationId,
        } = yield select(selectFields);

        const payload = {
            clientId: clientId,
            vehicleNumber: number,
            vehicleVin: vin,
            vehicleYear: year,
            vehicleModelId: modelId,
            vehicleModificationId: modificationId,
        };

        try{
            yield call(
                fetchAPI,
                'PUT',
                `clients/vehicles/${vehicleId}`,
                null,
                payload,
                {handleErrorInternally: true}
            );
        } catch(err) {
            notification.error({
                message: "Error"
            });
        }

        
    }
}

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            yield put(setFetchingClients(true));

            const filters = yield select(selectClientsFilters);
            const sort = yield select(selectClientsSort);

            const {clients, stats} = yield call(fetchAPI, 'GET', `clients`, {filters, sort});

            yield put(fetchClientsSuccess({clients, stats}));
        } finally {
            yield put(setFetchingClients(false));
        }
    }
}

export function* saga() {
    yield all([
        call(fetchVehicleSaga),
        call(fetchAllVehicleDataSaga),
        call(fetchVehicleDataByVinSaga),
        call(fetchVehiclesYearsSaga),
        call(fetchVehiclesMakesSaga),
        call(fetchVehiclesModelsSaga),
        call(fetchVehiclesModificationsSaga),
        call(createVehicleSaga),
        call(updateVehicleSaga),
        call(fetchClientsSaga),
    ]);
}
