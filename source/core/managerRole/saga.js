// vendor
import {
    call,
    put,
    all,
    take,
    select,
    takeEvery,
    takeLatest,
    delay,
} from 'redux-saga/effects';

//proj
import { emitError, setManagerRoleFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    setFilters,
    fetchManagerRoles,
    fetchManagerRolesSuccess,
    fetchManagerRolesError,
    hideForms,
} from './duck';

import {
    UPDATE_MANAGER_ROLE,
    FETCH_MANAGER_ROLES,
    SET_PAGE,
    SET_SORT,
    SET_FILTERS,
    SET_MANAGER_SEARCH_FILTER,
} from './duck';

export function* refetchManagerRolesSaga() {
    yield put(fetchManagerRoles());
}

export function* fetchManagerRolesSaga() {
    while (true) {
        try {
            yield take(FETCH_MANAGER_ROLES);
            const getParams = yield select(state => ({
                sort: {
                    ...state.managerRole.sort,
                    page: state.managerRole.page,
                },
                filters: {
                    ...state.managerRole.filters,
                },
            }));

            yield put(setManagerRoleFetchingState(true));

            const data = yield call(
                fetchAPI,
                'GET',
                'managers/roles/managers',
                getParams,
            );

            yield put(fetchManagerRolesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
            yield put(fetchManagerRolesError());
        } finally {
            yield put(setManagerRoleFetchingState(false));
        }
    }
}

function* setSearchQuerySaga({ payload }) {
    yield delay(1000);
    yield put(setFilters({ search: payload }));
}

function* updateManagerRoleSaga({
    payload: { managerId, roleIds, businessId },
}) {
    const entity = { roleIds, managerId, businessId };

    yield call(fetchAPI, 'POST', 'managers/roles/assign', null, entity);

    yield put(hideForms());
    yield put(fetchManagerRoles());
}

export function* saga() {
    yield all([
        takeLatest(SET_MANAGER_SEARCH_FILTER, setSearchQuerySaga),
        call(fetchManagerRolesSaga),
        takeEvery(UPDATE_MANAGER_ROLE, updateManagerRoleSaga),
        takeEvery([ SET_FILTERS, SET_SORT, SET_PAGE ], refetchManagerRolesSaga),
    ]);
}
