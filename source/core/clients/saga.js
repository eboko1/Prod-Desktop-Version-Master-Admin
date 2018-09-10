// vendor
import { call, put, takeEvery, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { spreadProp } from 'ramda-adjunct';
import _ from 'lodash';

//proj
import { setClientsFetchingState, emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchClients,
    fetchClientsSuccess,
    inviteClientsSuccess,
    selectFilter,
    FETCH_CLIENTS,
    INVITE_CLIENTS,
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

export function* inviteClients({ payload: { invites, filters } }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'clients', null, invites);

        yield put(inviteClientsSuccess(data));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
        yield put(fetchClients(filters));
    }
}

export function* setUniversalFilter() {
    while(true) {
        yield take(SET_UNIVERSAL_FILTERS);
        yield put(fetchClients());
    }
}

export function* saga() {
    /* eslint-disable array-element-newline */
    yield all([
        call(fetchClientsSaga),
        call(setUniversalFilter),
        takeEvery(INVITE_CLIENTS, inviteClients),
    ]);
    /* eslint-enable array-element-newline */
}
