// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setRoleFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchRoles, fetchRolesSuccess, fetchRolesError } from './duck';

import { CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE, FETCH_ROLES } from './duck';

export function* fetchRolesSaga() {
    while (true) {
        try {
            const {
                payload: { id },
            } = yield take(FETCH_ROLES);
            yield put(setRoleFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `managers/roles/${id}`);

            yield put(fetchRolesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
            yield put(fetchRolesError);
        } finally {
            yield put(setRoleFetchingState(false));
        }
    }
}

export function* updateRoleSaga() {
    while (true) {
        const {
            payload: { packageId, id, entity },
        } = yield take(UPDATE_ROLE);
        const payload = { ...entity, enabled: true };
        yield call(fetchAPI, 'PUT', `managers/roles/${id}`, null, payload);

        yield put(fetchRoles(packageId));
    }
}

export function* createRoleSaga() {
    while (true) {
        const {
            payload: { packageId, entity },
        } = yield take(CREATE_ROLE);
        const payload = { ...entity, enabled: true, packageId };

        yield call(fetchAPI, 'POST', 'managers/roles', null, payload);

        yield put(fetchRoles(packageId));
    }
}

export function* deleteRoleSaga() {
    while (true) {
        const {
            payload: { packageId, id },
        } = yield take(DELETE_ROLE);
        yield call(fetchAPI, 'DELETE', `managers/roles/${id}`);

        yield put(fetchRoles(packageId));
    }
}

export function* saga() {
    yield all([ call(fetchRolesSaga), call(updateRoleSaga), call(createRoleSaga), call(deleteRoleSaga) ]);
}
