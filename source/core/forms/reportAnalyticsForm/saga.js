// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import {fetchReportAnalytics} from 'core/reports/reportAnalytics/duck';

// own

import {
    createAnalyticsSuccess,
    fetchAnalyticsCatalogsSuccess
} from './duck'
import {
    FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM,
    CREATE_ANALYTICS_ANALYTICS_FORM,
} from './duck';

const selectFilter = ({ forms: {reportAnalyticsForm: { catalogsFilters } } }) => ({
    catalogsFilters
});

export function* createCatalogAnalyticsFormSaga() {
    while (true) {
        try {
            const {payload: {analyticsEntity}} = yield take(CREATE_ANALYTICS_ANALYTICS_FORM);

            yield call(fetchAPI, 'POST', 'report/analytics', null, analyticsEntity);

            yield put(createAnalyticsSuccess());
            // fetchReportAnalytics(); //Update ???
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchAnalyticsCatalogsAnalyticsFormSaga() {
    while (true) {
        try {
            yield take(FETCH_ANALYTICS_CATALOGS_ANALYTICS_FORM);

            const {
                catalogsFilters
            } = yield select(selectFilter);

            const filters = {...catalogsFilters};

            const {analytics} = yield call(fetchAPI, 'GET', 'report/analytics', {filters});

            yield put(fetchAnalyticsCatalogsSuccess(analytics));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([ call(createCatalogAnalyticsFormSaga), call(fetchAnalyticsCatalogsAnalyticsFormSaga) ]);
}
/* eslint-enable array-element-newline */
