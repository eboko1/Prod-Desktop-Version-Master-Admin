// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { setClientOrdersFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchClientOrdersSuccess } from './duck';

import {
    FETCH_CLIENT_ORDERS,
} from './duck';
import _ from "lodash";
import {spreadProp} from "ramda-adjunct";

const selectFilter = ({ clientOrders: { filter, sort } }) => ({
    sort,
    filter,
});

export function* fetchClientOrdersSaga() {
    while (true) {
        try {
            const {
                payload: { clientId },
            } = yield take(FETCH_CLIENT_ORDERS);
            yield put(setClientOrdersFetchingState(true));

            const {
                filter,
                sort: { field: sortField, order: sortOrder },
            } = yield select(selectFilter);
            const filters = { ...filter, sortField, sortOrder };

            const data = yield call(fetchAPI, 'GET', `orders/client/${clientId}`, filters);
            yield put(fetchClientOrdersSuccess(data));
        } finally {
            yield put(setClientOrdersFetchingState(false));
        }
    }
}


export function* saga() {
    yield all([ call(fetchClientOrdersSaga) ]);
}
