// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';
import history from 'store/history';
import book from 'routes/book';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    selectOrdersQuery,
    selectservices,
    selectDetails,
    selectSelectedOrderId,
    setOrdersFetching,
} from './duck';

import {
    FETCH_ORDERS,
    ADD_LABOR_TO_ORDER,
    ADD_DETAILS_TO_ORDER,
} from './duck';

export function* fetchOrdersSaga() {
    while (true) {
        yield take(FETCH_ORDERS);

        yield put(setOrdersFetching(true));

        const query = yield select(selectOrdersQuery);

        try{
            const { orders, stats } = yield call(fetchAPI, 'GET', `orders`, { ...query }, null, {handleErrorInternally: true});
            yield put(fetchOrdersSuccess({ orders, stats }));
        } catch(err) {
            console.log(err, query);
        } finally {
            yield put(setOrdersFetching(false));
        }        
    }
}

export function* addLaborToOrderSaga() {
    while (true) {
        yield take(ADD_LABOR_TO_ORDER);

        const selectedOrderId = yield select(selectSelectedOrderId);
        const services = yield select(selectservices);

        console.log("Data: ", services, selectedOrderId);

        if(!services || !selectedOrderId) continue;

        const payload = {
			insertMode: true,
			details: [],
			services: [],
		};

        payload.services.push({
            serviceId: services[0].laborId,
            serviceName: services[0].serviceName || services[0].defaultName,
            employeeId: services[0].employeeId,
            serviceHours: 0,
            purchasePrice: 0,
            count: Number(services[0].hours) || 0,
            servicePrice: Number(services[0].price),
        });

        try{
            yield call(fetchAPI, 'PUT', `orders/${selectedOrderId}`, null, payload, {handleErrorInternally: true});
            history.push({
                pathname: `${book.order}/${selectedOrderId}`,
            });
        } catch(err) {
            console.log(err, query);
        }
    }
}

export function* addDetailsToOrderSaga() {
    while (true) {
        yield take(ADD_DETAILS_TO_ORDER);

        const selectedOrderId = yield select(selectSelectedOrderId);
        const details = yield select(selectDetails);

        console.log("Data: ", details, selectedOrderId);

        if(!details || !selectedOrderId) continue;

        const payload = {
			insertMode: true,
			details: [],
			services: [],
		};

        payload.details.push({
            storeGroupId: details[0].storeGroupId,
            name: details[0].name,
            productCode: details[0].productCode,
            supplierBrandId: details[0].supplierBrandId,
            count: 1,
            price: 0,
            purchasePrice: 0,
        })

        try{
            yield call(fetchAPI, 'PUT', `orders/${selectedOrderId}`, null, payload, {handleErrorInternally: true});
            history.push({
                pathname: `${book.order}/${selectedOrderId}`,
            });
        } catch(err) {
            console.log(err, query);
        }
    }
}

export function* saga() {
    yield all([
        call(fetchOrdersSaga),
        call(addLaborToOrderSaga),
        call(addDetailsToOrderSaga),
    ]);
}
