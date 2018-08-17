// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setPackageFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchPackages,
    fetchPackagesSuccess,
    fetchPackagesError,
    hideForms,
    addError,
} from './duck';

import {
    CREATE_PACKAGE,
    UPDATE_PACKAGE,
    DELETE_PACKAGE,
    FETCH_PACKAGES,
} from './duck';

export function* fetchPackagesSaga() {
    while (true) {
        try {
            yield take(FETCH_PACKAGES);
            yield put(setPackageFetchingState(true));

            const data = yield call(fetchAPI, 'GET', 'managers/packages');

            yield put(fetchPackagesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
            yield put(fetchPackagesError);
        } finally {
            yield put(setPackageFetchingState(false));
        }
    }
}

export function* updatePackageSaga() {
    while (true) {
        const {
            payload: { id, entity },
        } = yield take(UPDATE_PACKAGE);
        yield call(fetchAPI, 'PUT', `managers/packages/${id}`, null, entity);

        yield put(hideForms());
        yield put(fetchPackages());
    }
}

export function* createPackageSaga() {
    while (true) {
        const {
            payload: { entity },
        } = yield take(CREATE_PACKAGE);
        try {
            yield call(fetchAPI, 'POST', 'managers/packages', null, entity, {
                handleErrorInternally: true,
            });
            yield put(hideForms());
            yield put(fetchPackages());
        } catch ({ message, status }) {
            yield put(addError({ message, status }));
        }
    }
}

export function* deletePackageSaga() {
    while (true) {
        const {
            payload: { id },
        } = yield take(DELETE_PACKAGE);
        yield call(fetchAPI, 'DELETE', `managers/packages/${id}`);

        yield put(fetchPackages());
    }
}

export function* saga() {
    yield all([ call(fetchPackagesSaga), call(updatePackageSaga), call(createPackageSaga), call(deletePackageSaga) ]);
}
