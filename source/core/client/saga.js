// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setClientFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchClient, fetchClientSuccess } from './duck';

import { FETCH_CLIENT, CREATE_CLIENT_VEHICLE } from './duck';

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
        } = clientVehicle;

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
        yield put(fetchClient(clientId));
    }
}

export function* saga() {
    yield all([ call(fetchClientSaga), call(createClientVehicleSaga) ]);
}
