// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { setClientOrdersFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchClientOrdersSuccess } from './duck';

import {
    FETCH_CLIENT_ORDERS,
} from './duck';

export function* fetchClientOrdersSaga() {
    while (true) {
        try {
            const {
                payload: { clientId, filter: {page} },
            } = yield take(FETCH_CLIENT_ORDERS);
            yield put(setClientOrdersFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `orders/client/${clientId}?page=${page}`);
            yield put(fetchClientOrdersSuccess(data));
        } finally {
            yield put(setClientOrdersFetchingState(false));
        }
    }
}


export function* saga() {
    yield all([ call(fetchClientOrdersSaga) ]);
}
