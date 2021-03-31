// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
import { emitError } from 'core/ui/duck';

// own
import {
    fetchCashOrdersLogsSuccess,
} from './duck';

import {
    FETCH_CASH_ORDER_LOGS
} from './duck';

export function* fetchCashOrdersLogsSaga() {
    while (true) {
        try {
            yield take(FETCH_CASH_ORDER_LOGS);

            const data = yield call(
                fetchAPI,
                'GET',
                `/cashdesk/logs`,
                {filters: {page: 1}}
            );
            yield put(fetchCashOrdersLogsSuccess(data));
        } catch(err) {
            emitError(err);
        }
    }
}

export function* saga() {
    yield all([ call(fetchCashOrdersLogsSaga) ]);
}
