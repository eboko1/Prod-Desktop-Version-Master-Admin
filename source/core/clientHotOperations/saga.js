// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import moment from 'moment';
import { notification } from 'antd';
import history from 'store/history';

//proj
import book from 'routes/book';
import { fetchAPI } from 'utils';

// own
import {
    fetchClientsSuccess,
    selectFilters,
    selectSort,
    setClientsFetching,
    setClientOrdersFetching,
    fetchClientOrdersSuccess,
} from './duck';

import {
    FETCH_CLIENTS,
    FETCH_CLIENT_ORDERS,
    CREATE_ORDER_FOR_CLIENT
} from './duck';

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            yield put(setClientsFetching(true));

            const filters = yield select(selectFilters);
            const sort = yield select(selectSort);

            const {clients, stats} = yield call(
                fetchAPI,
                'GET',
                `/clients`,
                {filters, sort},
            );

            yield put(fetchClientsSuccess({clients, stats}));
        } finally {
            yield put(setClientsFetching(false));
        }
    }
}

export function* fetchClientOrdersSaga() {
    while (true) {
        try {
            const {payload: {clientId}} = yield take(FETCH_CLIENT_ORDERS);
            yield put(setClientOrdersFetching(true));

            const {orders, stats} = yield call(
                fetchAPI,
                'GET',
                `/orders/client/${clientId}`
            );
            
            yield put(fetchClientOrdersSuccess({orders, stats}));
        } finally {
            yield put(setClientOrdersFetching(false));
        }
    }
}

export function* createOrderForClientSaga() {
    while(true) {
        const { payload: {clientId, managerId, vehicleId} } = yield take(CREATE_ORDER_FOR_CLIENT);
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
    yield all([ call(fetchClientsSaga), call(fetchClientOrdersSaga), call(createOrderForClientSaga) ]);
}
