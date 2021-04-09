// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';
import {setReportOrdersFetching, emitError} from 'core/ui/duck';

// own
import {
    fetchClientsSuccess
} from './duck';

import {
    FETCH_CLIENTS
} from './duck';

// const selectFilter = ({ reportOrders: { filter, options, exportOptions } }) => ({
//     filter,
//     options,
//     exportOptions
// });

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            // yield put(setReportOrdersFetching(true));

            // const {
            //     filter,
            // } = yield select(selectFilter);

            const {clients} = yield call(
                fetchAPI,
                'GET',
                `/clients`,
                {sort: {page: 1}},
            );

            console.log(clients);

            yield put(fetchClientsSuccess({clients}));
        } finally {
            // yield put(setReportOrdersFetching(false));
        }
    }
}


export function* saga() {
    yield all([ call(fetchClientsSaga) ]);
}
