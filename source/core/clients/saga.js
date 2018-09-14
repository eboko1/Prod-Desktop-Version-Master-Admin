// vendor
import { call, put, takeEvery, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchClients,
    fetchClientsSuccess,
    selectFilter,
    FETCH_CLIENTS,
    CREATE_INVITE,
    SET_UNIVERSAL_FILTERS,
    // SET_CLIENTS_STATUS_FILTER,
} from './duck';
import moment from 'moment/moment';

function mergeFilters(universalFilters) {
    const modelsTransformQuery =
        universalFilters.models && universalFilters.models.length
            ? {
                models: _(universalFilters.models)
                    .map(model => model.split(','))
                    .flatten()
                    .value(),
            }
            : {};

    const [ startDate, endDate ] = universalFilters.beginDate || [];
    const [ createStartDate, createEndDate ] = universalFilters.createDate || [];

    const momentFields = _({
        startDate,
        endDate,
        createEndDate,
        createStartDate,
    })
        .pickBy(moment.isMoment)
        .mapValues(momentDate => momentDate.format('YYYY-MM-DD'))
        .value();

    return _.omit(
        {
            ...universalFilters,
            ...modelsTransformQuery,
            ...momentFields,
        },
        [ 'beginDate', 'createDate' ],
    );
}

export function* fetchClientsSaga() {
    while (true) {
        try {
            yield take(FETCH_CLIENTS);
            yield nprogress.start();

            const { filter, sort, universalFilter } = yield select(
                selectFilter,
            );
            const data = yield call(fetchAPI, 'GET', 'clients', {
                filters: { ...filter, ...mergeFilters(universalFilter) },
                sort,
            });

            yield put(fetchClientsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* inviteClients({ payload: invite }) {
    try {
        yield nprogress.start();
        yield call(fetchAPI, 'POST', 'orders', null, [ invite ]);
    } finally {
        yield nprogress.done();
        yield put(fetchClients());
    }
}

export function* setUniversalFilter() {
    while (true) {
        yield take(SET_UNIVERSAL_FILTERS);
        yield put(fetchClients());
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        call(fetchClientsSaga),
        call(setUniversalFilter),
        takeEvery(CREATE_INVITE, inviteClients),
    ]);
    /* eslint-enable array-element-newline */
}
