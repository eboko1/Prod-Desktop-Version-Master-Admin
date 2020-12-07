// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
// import { setClientMRDsFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchReportOrdersSuccess,
} from './duck';

import {
    FETCH_REPORT_ORDERS,
} from './duck';

const selectFilter = ({ reportOrders: { filter, sort } }) => ({
    sort,
    filter,
});

export function* fetchReportOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ORDERS);
            // yield put(setClientMRDsFetchingState(true));

            const {
                filter
            } = yield select(selectFilter);
            const filters = { ...filter};

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/orders`,
                {filters},
            );
            yield put(fetchReportOrdersSuccess(data));
        } finally {
            // yield put(setClientMRDsFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportOrdersSaga) ]);
}
