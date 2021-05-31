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
    fetchVehicleNormHoursSuccess,
    fetchVehicleLaborsSuccess,
    fetchVehicleAppurtenancesSuccess,
    fetchVehicleRecommendationsSuccess,

    setFetchingVehicle,
    setFetchingVehicleOrders,
    setFetchingVehicles,
    setFetchingVehicleClient,
    setFetchingVehicleAttributes,
    setFetchingOrdersLatest,


    selectSort,
    selectVehicleNormHoursSort,
    selectVehicleRecommendationsQuery,
    selectVehicleLaborsSort,
    selectFilters,
    selectExpandedVehicleId,

    FETCH_VEHICLE,
    FETCH_VEHICLES,
    FETCH_VEHICLE_ORDERS,
    FETCH_VEHICLE_NORM_HOURS,
    FETCH_VEHICLE_LABORS,
    CREATE_ORDER,
    FETCH_VEHICLE_APPURTENANCES,
    FETCH_VEHICLE_RECOMMENDATIONS,
    FETCH_VEHICLE_ATTRIBUTES,
    FETCH_VEHICLE_ORDERS_LATEST,
    selectVehicleAppurtenancesSort,
    selectVehicleOrdersSort,
    fetchVehicleAttributesSuccess,
    fetchVehicleOrdersLatestSuccess,
} from './duck';

export function* fetchVehicleSaga() {
    while (true) {
        try {
            const { payload: {vehicleId} } = yield take(FETCH_VEHICLE);

            yield nprogress.start();

            yield put(setFetchingVehicle(true));
            yield put(setFetchingVehicleClient(true));

            const vehicle = yield call(fetchAPI, 'GET', `clients/vehicles/${vehicleId}`);

            yield put(setFetchingVehicle(false));
            yield put(fetchVehicleSuccess({vehicle}));

            const { clientId } = vehicle;

            const client = yield call(fetchAPI, 'GET', `clients/${clientId}`);

            yield put(setFetchingVehicleClient(false));
            yield put(fetchVehicleSuccess({client}));


        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();

            yield put(setFetchingVehicle(false));
            yield put(setFetchingVehicleClient(false));
        }
    }
}

export function* fetchVehicleAttributesSaga() {
    while (true) {
        try {
            const { payload: {vehicleId} } = yield take(FETCH_VEHICLE_ATTRIBUTES);

            yield nprogress.start();

            yield put(setFetchingVehicleAttributes(true));

            const vehicleAttributes = yield call(fetchAPI, 'GET', `tecdoc/vehicle/attributes`, {vehicleId: vehicleId});

            yield put(setFetchingVehicleAttributes(false));

            yield put(fetchVehicleAttributesSuccess({vehicleAttributes}));

        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();

            yield put(setFetchingVehicleAttributes(false));
        }
    }
}

export function* fetchVehicleOrdersLatestSaga() {
    while (true) {
        try {
            const { payload: {vehicleId} } = yield take(FETCH_VEHICLE_ORDERS_LATEST);

            yield nprogress.start();

            yield put(setFetchingOrdersLatest(true));

            const generalData = yield call(fetchAPI, 'GET', `order_latest_info`, {vehicleId: vehicleId});
            yield put(setFetchingOrdersLatest(false));

            yield put(fetchVehicleOrdersLatestSuccess({generalData}));

        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();

            yield put(setFetchingOrdersLatest(false));
        }
    }
}

export function* fetchVehiclesSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLES);

            yield put(setFetchingVehicles(true));

            const sort = yield select(selectSort);
            const filters = yield select(selectFilters);

            yield nprogress.start();

            const {clientsVehicles, clientsVehiclesStats} = yield call(fetchAPI, 'GET', `vehicles`, {sort, filters});

            yield put(fetchVehiclesSuccess({vehicles: clientsVehicles, stats: clientsVehiclesStats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
            yield put(setFetchingVehicles(false));
        }
    }
}

export function* fetchVehicleOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_ORDERS);

            yield put(setFetchingVehicleOrders(true));

            const vehicleId = yield select(selectExpandedVehicleId);

            const sort = yield select(selectVehicleOrdersSort);

            yield nprogress.start();

            const {orders, stats} = yield call(fetchAPI, 'GET', `orders/vehicle/${vehicleId}`, {page: sort.page});

            yield put(fetchVehicleOrdersSuccess({orders, stats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
            yield put(setFetchingVehicleOrders(false));
        }
    }
}


export function* fetchVehicleNormHoursSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_NORM_HOURS);

            const sort = yield select(selectVehicleNormHoursSort)

            const vehicleId = yield select(selectExpandedVehicleId);

            yield nprogress.start();

            const {standardHours: normHours, statsStandardHours: normHoursStats} = yield call(fetchAPI, 'GET', `standard_hours`, {vehicleId, page: sort.page});

            yield put(fetchVehicleNormHoursSuccess({normHours, stats: normHoursStats}));
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

            const sort = yield select(selectVehicleLaborsSort);

            yield nprogress.start();

            const {labors, laborsStats} = yield call(fetchAPI, 'GET', `orders/labors/${vehicleId}`, {page: sort.page});

            yield put(fetchVehicleLaborsSuccess({labors, stats: laborsStats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchVehicleAppurtenancesSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_APPURTENANCES);

            const vehicleId = yield select(selectExpandedVehicleId);

            const sort = yield select(selectVehicleAppurtenancesSort);

            yield nprogress.start();

            const {appurtenances, appurtenancesStats} = yield call(fetchAPI, 'GET', `orders/appurtenances/${vehicleId}`, { page: sort.page });

            yield put(fetchVehicleAppurtenancesSuccess({appurtenances, stats: appurtenancesStats}));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* fetchVehicleRecommendationsSaga() {
    while (true) {
        try {
            yield take(FETCH_VEHICLE_RECOMMENDATIONS);

            const vehicleId = yield select(selectExpandedVehicleId);
            const queryParams = yield select(selectVehicleRecommendationsQuery);

            yield nprogress.start();

            const {recommendations, recommendationsStats} = yield call(fetchAPI, 'GET', `orders/recommendations/${vehicleId}`, queryParams);

            yield put(fetchVehicleRecommendationsSuccess({recommendations, stats: recommendationsStats}));
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
        call(fetchVehicleOrdersLatestSaga),
        call(fetchVehicleAttributesSaga),
        call(fetchVehicleOrdersSaga),
        call(fetchVehicleNormHoursSaga),
        call(fetchVehicleLaborsSaga),
        call(fetchVehicleAppurtenancesSaga),
        call(fetchVehicleRecommendationsSaga),
        call(createOrderSaga),
    ]);
}
