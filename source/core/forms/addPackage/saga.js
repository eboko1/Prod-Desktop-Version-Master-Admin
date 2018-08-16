// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchPackages,
    fetchPackagesSuccess,
    fetchPackagesError,
} from './duck';
import { CREATE_PACKAGE, UPDATE_PACKAGE, FETCH_PACKAGES } from './duck';

export function* fetchPackagesSaga() {
    while (true) {
        try {
            yield take(FETCH_PACKAGES);
            const data = yield call(fetchAPI, 'GET', 'managers/packages');

            yield put(fetchPackagesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
            yield put(fetchPackagesError);
        }
    }
}

export function* updatePackageSaga() {
    while (true) {
        const {
            payload: { id, entity },
        } = yield take(UPDATE_PACKAGE);
        yield call(fetchAPI, 'PUT', `managers/packages/${id}`, null, entity);

        yield put(fetchPackages());
    }
}

export function* createPackageSaga() {
    while (true) {
        const {
            payload: { entity },
        } = yield take(CREATE_PACKAGE);
        yield call(fetchAPI, 'POST', 'managers/packages', null, entity);

        yield put(fetchPackages());
    }
}

export function* saga() {
    yield all([ call(fetchPackagesSaga), call(updatePackageSaga), createPackageSaga() ]);
}
