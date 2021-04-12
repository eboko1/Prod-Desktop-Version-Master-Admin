// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';
import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchClientsSuccess,
    selectFilters,
    selectSort,
    setClientsFetching
} from './duck';

import {
    FETCH_CLIENTS
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


export function* saga() {
    yield all([ call(fetchClientsSaga) ]);
}
