// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
import {setReportOrdersFetching} from 'core/ui/duck';

// own
import {
    fetchReportOrdersSuccess,
    fetchReportOrdersFilterOptionsSuccess
} from './duck';

import {
    FETCH_REPORT_ORDERS,
    FETCH_REPORT_ORDERS_FILTER_OPTIONS
} from './duck';

const selectFilter = ({ reportOrders: { filter, sort, options } }) => ({
    sort,
    filter,
    options
});

export function* fetchReportOrdersSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ORDERS);
            yield put(setReportOrdersFetching(true));

            const {
                filter,
                options
            } = yield select(selectFilter);

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/orders`,
                {filters: {...filter}, options},
            );
            yield put(fetchReportOrdersSuccess(data));
        } finally {
            yield put(setReportOrdersFetching(false));
        }
    }
}

export function* fetchReportOrdersFilterOptionsSaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_ORDERS_FILTER_OPTIONS);

            const data = yield call(
                fetchAPI,
                'GET',
                `/orders/form`
            );
            yield put(fetchReportOrdersFilterOptionsSuccess(data));
        } finally {
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportOrdersSaga), call(fetchReportOrdersFilterOptionsSaga) ]);
}
