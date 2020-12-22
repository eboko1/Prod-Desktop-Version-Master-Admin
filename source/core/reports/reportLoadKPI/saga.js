// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';
// import {setReportOrdersFetching} from 'core/ui/duck';

// own
import {
    fetchReportLoadKPISuccess,
} from './duck';

import {
    FETCH_REPORT_LOAD_KPI,
} from './duck';

const selectFilter = ({ reportLoadKPI: { filter } }) => ({
    filter,
});

export function* fetchReportLoadKPISaga() {
    while (true) {
        try {
            yield take(FETCH_REPORT_LOAD_KPI);
            // yield put(setReportOrdersFetching(true));

            const {
                filter,
            } = yield select(selectFilter);

            const data = yield call(
                fetchAPI,
                'GET',
                `/report/load_kpi`,
                {filters: {...filter}},
            );
            yield put(fetchReportLoadKPISuccess(data));
        } finally {
            // yield put(setReportOrdersFetching(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchReportLoadKPISaga)]);
}
