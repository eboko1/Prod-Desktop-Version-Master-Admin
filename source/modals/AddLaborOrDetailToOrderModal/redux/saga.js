// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchOrdersSuccess,
    selectOrdersQuery
} from './duck';

import {
    FETCH_ORDERS,
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


export function* saga() {
    yield all([
        call(fetchOrdersSaga),
    ]);
}
