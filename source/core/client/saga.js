// vendor
import { call, put, all, take } from 'redux-saga/effects';
import _ from 'lodash';
import { notification } from 'antd';
import moment from "moment";

//proj
import { setClientFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import history from 'store/history';
import book from 'routes/book';

// own
import { fetchClient, fetchClientSuccess } from './duck';
import { addError } from './../forms/editClientVehicleForm/duck';

import {
    FETCH_CLIENT,
    CREATE_CLIENT_VEHICLE,
    UPDATE_CLIENT_VEHICLE,
    DELETE_CLIENT_VEHICLE,
    CREATE_ORDER_FOR_CLIENT
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
            _.omit(clientVehicle, 'barcode'),
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

export function* createOrderForClientSaga() {
    while(true) {
        const { payload: {clientId, managerId} } = yield take(CREATE_ORDER_FOR_CLIENT);
        if(!clientId) continue;
        
        //Get client
        const client = yield call(fetchAPI, 'GET', `clients/${clientId}`);
        
        try {
            const response = yield call(
                fetchAPI,
                'POST',
                `orders`,
                null,
                {
                    clientId: client.clientId,
                    duration: 0.5,
                    clientPhone: client.phones[0],
                    stationLoads: [{
                        beginDatetime: moment().startOf('hour').toISOString(),
                        duration: 0.5,
                        status: "TO_DO",
                    }],
                    status: 'not_complete',
                    managerId: managerId,
                    beginDatetime: moment().startOf('hour').toISOString(),
                }, 
                {handleErrorInternally: true}
            );

            if(response && response.created) {
                // If successfully created new order redirect on its page 
                history.push({
                    pathname: `${book.order}/${response.created[0].id}`
                });
            }

        } catch(err) {
            const { response } = err;
            console.error(err);
            response && notification.error({
                message: response.message
            })
        }
    }
}

export function* saga() {
    yield all([
        call(fetchClientSaga),
        call(createClientVehicleSaga),
        call(updateClientVehicleSaga),
        call(deleteClientVehicleSaga),
        call(createOrderForClientSaga)
    ]);
}
