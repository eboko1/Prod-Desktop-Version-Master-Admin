// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';
import moment from 'moment';
import { notification } from 'antd';
import history from 'store/history';

//proj
import book from 'routes/book';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchVehicleSuccess,
    fetchVehiclesSuccess,
    fetchVehicleOrdersSuccess,
    fetchVehicleLaborsSuccess,

    selectSort,
    selectFilters,
    selectExpandedVehicleId,

    FETCH_VEHICLE,
    FETCH_VEHICLES,
    FETCH_VEHICLE_ORDERS,
    FETCH_VEHICLE_LABORS,
    CREATE_ORDER,
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

export function* fetchVehicleOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_ORDERS);

            const vehicleId = yield select(selectExpandedVehicleId);

            yield nprogress.start();

            const {orders, stats} = yield call(fetchAPI, 'GET', `orders/vehicle/${vehicleId}`);

            yield put(fetchVehicleOrdersSuccess({orders, stats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchVehicleLaborsSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_LABORS);

            const vehicleId = yield select(selectExpandedVehicleId);

            yield nprogress.start();

            const {labors, laborsStats} = yield call(fetchAPI, 'GET', `orders/labors/${vehicleId}`);

            yield put(fetchVehicleLaborsSuccess({labors, stats: laborsStats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* createOrderSaga() {
    while(true) {
        const { payload: {clientId, managerId, vehicleId} } = yield take(CREATE_ORDER);
        if(!clientId) continue;
        
        const client = yield call(fetchAPI, 'GET', `clients/${clientId}`);//Get client
        
        try {
            //Create new order
            const response = yield call(
                fetchAPI,
                'POST',
                `orders`,
                null,
                {
                    clientId: client.clientId,
                    clientVehicleId: vehicleId ? vehicleId : void 0,
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
        call(fetchVehicleSaga),
        call(fetchVehiclesSaga),
        call(fetchVehicleOrdersSaga),
        call(fetchVehicleLaborsSaga),
        call(createOrderSaga),
    ]);
}
