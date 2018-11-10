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
            yield take(FETCH_ROLES);
            yield put(setRoleFetchingState(true));

            const data = yield call(fetchAPI, 'GET', 'managers/roles');

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
            payload: { id, entity },
        } = yield take(UPDATE_ROLE);
        const payload = { ...entity, enabled: true };
        yield call(fetchAPI, 'PUT', `managers/roles/${id}`, null, payload);

        yield put(fetchRoles());
    }
}

export function* createRoleSaga() {
    while (true) {
        const {
            payload: { entity },
        } = yield take(CREATE_ROLE);
        const payload = { ...entity, enabled: true };

        yield call(fetchAPI, 'POST', 'managers/roles', null, payload);

        yield put(fetchRoles());
    }
}

export function* deleteRoleSaga() {
    while (true) {
        const {
            payload: { id },
        } = yield take(DELETE_ROLE);
        yield call(fetchAPI, 'DELETE', `managers/roles/${id}`);

        yield put(fetchRoles());
    }
}

export function* saga() {
    yield all([ call(fetchRolesSaga), call(updateRoleSaga), call(createRoleSaga), call(deleteRoleSaga) ]);
}
