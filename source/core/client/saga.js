// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setClientFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchClient, fetchClientSuccess } from './duck';
import { addError } from './../forms/editClientVehicleForm/duck';

import {
    FETCH_CLIENT,
    CREATE_CLIENT_VEHICLE,
    UPDATE_CLIENT_VEHICLE,
    DELETE_CLIENT_VEHICLE,
} from './duck';

export function* fetchClientSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_CLIENT);
            yield put(setClientFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `clients/${id}`);
            yield put(fetchClientSuccess(data));
        } finally {
            yield put(setClientFetchingState(false));
        }
    }
}

export function* updateClientVehicleSaga() {
    while (true) {
        const {
            payload: { clientVehicleId, clientId, clientVehicle },
        } = yield take(UPDATE_CLIENT_VEHICLE);

        yield call(
            fetchAPI,
            'PUT',
            `clients/vehicles/${clientVehicleId}`,
            null,
            clientVehicle,
        );

        yield put(fetchClient(clientId));
    }
}

export function* createClientVehicleSaga() {
    while (true) {
        const {
            payload: { clientId, clientVehicle },
        } = yield take(CREATE_CLIENT_VEHICLE);
        const {
            modificationId: vehicleModificationId,
            number: vehicleNumber,
            vin: vehicleVin,
            modelId: vehicleModelId,
            year: vehicleYear,
            vehicleTypeId: vehicleTypeId,
            wheelRadius: wheelRadius,
        } = clientVehicle;

        const payload = {
            vehicleModelId,
            vehicleModificationId,
            vehicleVin,
            vehicleNumber,
            vehicleYear,
            vehicleTypeId,
            wheelRadius,
        };

        yield call(
            fetchAPI,
            'POST',
            `clients/${clientId}/vehicles`,
            null,
            payload,
        );
        yield put(fetchClient(clientId));
    }
}

export function* deleteClientVehicleSaga() {
    while (true) {
        const {
            payload: { clientId, clientVehicleId },
        } = yield take(DELETE_CLIENT_VEHICLE);

        try {
            yield call(
                fetchAPI,
                'DELETE',
                `clients/vehicles/${clientVehicleId}`,
                null,
                null,
                { handleErrorInternally: true },
            );
        } catch ({ response, status }) {
            yield put(addError({ response, status }));

            continue;
        }
        yield put(fetchClient(clientId));
    }
}

export function* saga() {
    yield all([
        call(fetchClientSaga),
        call(createClientVehicleSaga),
        call(updateClientVehicleSaga),
        call(deleteClientVehicleSaga),
    ]);
}
