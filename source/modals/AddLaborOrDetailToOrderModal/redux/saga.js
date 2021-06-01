// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    selectOrdersQuery,
    selectservices,
    selectSelectedOrderId,
} from './duck';

import {
    FETCH_ORDERS,
    ADD_LABOR_TO_ORDER,
} from './duck';

export function* fetchOrdersSaga() {
    while (true) {
        yield take(FETCH_ORDERS);

        const query = yield select(selectOrdersQuery);

        try{
            const { orders, stats } = yield call(fetchAPI, 'GET', `orders`, { ...query }, null, {handleErrorInternally: true});
            yield put(fetchOrdersSuccess({ orders, stats }));
        } catch(err) {
            console.log(err, query);
        }
        
    }
}

export function* addLaborToOrderSaga() {
    while (true) {

        // const labor = await fetchAPI('GET', `labors/${barcodeData.referenceId}`);
		// 		activeTab = 'services';
		// 		payload.services.push({
		// 			serviceId: labor.id,
		// 			serviceName: labor.name || labor.defaultName,
		// 			employeeId: this.props.defaultEmployeeId,
		// 			serviceHours: 0,
		// 			purchasePrice: 0,
		// 			count: Number(labor.laborPrice.normHours) || 0,
		// 			servicePrice: Number(labor.laborPrice.price) || this.props.normHourPrice,
		// 		})
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
            const { orders, stats } = yield call(fetchAPI, 'PUT', `orders/${selectedOrderId}`, null, payload, {handleErrorInternally: true});
        } catch(err) {
            console.log(err, query);
        }
        


        // try{
        //     const { orders, stats } = yield call(fetchAPI, 'GET', `orders`, { ...query }, null, {handleErrorInternally: true});
        //     yield put(fetchOrdersSuccess({ orders, stats }));
        // } catch(err) {
        //     console.log(err, query);
        // }
        
    }
}

export function* saga() {
    yield all([
        call(fetchOrdersSaga),
        call(addLaborToOrderSaga),
    ]);
}
