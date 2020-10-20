// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { setClientMRDsFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchClientMRDsSuccess
} from './duck';

import {
    FETCH_CLIENT_MRDS,
} from './duck';

const selectFilter = ({ clientMRDs: { filter, sort } }) => ({
    sort,
    filter,
});

export function* fetchClientMRDsSaga() {
    while (true) {
        try {
            const {payload: { clientId }} = yield take(FETCH_CLIENT_MRDS);
            yield put(setClientMRDsFetchingState(true));

            const {
                filter,
                sort,
            } = yield select(selectFilter);
            const filters = { ...filter, clientId};

            const data = yield call(
                fetchAPI,
                'GET',
                `/mrds`,
                {filters, sort},
            );
            yield put(fetchClientMRDsSuccess(data));
        } finally {
            yield put(setClientMRDsFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchClientMRDsSaga)]);
}
