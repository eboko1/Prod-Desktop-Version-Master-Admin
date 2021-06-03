// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import { emitError } from 'core/ui/duck';
import _ from 'lodash';
import history from 'store/history';
import book from 'routes/book';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    selectOrdersQuery,
    selectLabors,
    selectDetails,
    selectSelectedOrderId,
    setOrdersFetching,
} from './duck';

import {
    FETCH_ORDERS,
    ADD_LABORS_TO_ORDER,
    ADD_DETAILS_TO_ORDER,
} from './duck';

export function* fetchOrdersSaga() {
    while (true) {
        try{
            yield take(FETCH_ORDERS);
            yield put(setOrdersFetching(true));

            const query = yield select(selectOrdersQuery);

            const { orders, stats } = yield call(fetchAPI, 'GET', `orders`, { ...query }, null, {handleErrorInternally: true});

            yield put(fetchOrdersSuccess({ orders, stats }));
        } catch(error) {
            yield put(emitError(error));
        } finally {
            yield put(setOrdersFetching(false));
        }        
    }
}

export function* addLaborsToOrderSaga() {
    while (true) {
        try{
            yield take(ADD_LABORS_TO_ORDER);

            const selectedOrderId = yield select(selectSelectedOrderId);
            const labors = yield select(selectLabors);

            const payload = {
                insertMode: true,
                details: [],
                services: [],
            };

            _.each(labors, labor => {
                payload.services.push({
                    serviceId: labor.laborId,
                    serviceName: labor.serviceName || labor.defaultName,
                    employeeId: labor.employeeId,
                    serviceHours: 0,
                    purchasePrice: 0,
                    count: Number(labor.hours) || 0,
                    servicePrice: Number(labor.price),
                });
            });
        
            yield call(fetchAPI, 'PUT', `orders/${selectedOrderId}`, null, payload, {handleErrorInternally: true});

            history.push({
                pathname: `${book.order}/${selectedOrderId}`,
            });
        } catch(error) {
            yield put(emitError(error));
        }
    }
}

export function* addDetailsToOrderSaga() {
    while (true) {
        try{
            yield take(ADD_DETAILS_TO_ORDER);

            const selectedOrderId = yield select(selectSelectedOrderId);
            const details = yield select(selectDetails);

            const payload = {
                insertMode: true,
                details: [],
                services: [],
            };

            _.each(details, product => {
                payload.details.push({
                    storeGroupId: product.storeGroupId,
                    name: product.name,
                    productCode: product.productCode,
                    supplierBrandId: product.supplierBrandId,
                    count: 1,
                    price: 0,
                    purchasePrice: 0,
                })
            });

        
            yield call(fetchAPI, 'PUT', `orders/${selectedOrderId}`, null, payload, {handleErrorInternally: true});
            history.push({
                pathname: `${book.order}/${selectedOrderId}`,
            });            
        } catch(error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([
        call(fetchOrdersSaga),
        call(addLaborsToOrderSaga),
        call(addDetailsToOrderSaga),
    ]);
}
