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
        try {
            yield call(
                fetchAPI,
                'PUT',
                `managers/packages/${id}`,
                null,
                entity,
                { handleErrorInternally: true },
            );
        } catch ({ response, status }) {
            yield put(addError({ response, status }));

            continue;
        }

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
        } catch ({ response, status }) {
            yield put(addError({ response, status }));

            continue;
        }

        yield put(hideForms());
        yield put(fetchPackages());
    }
}

export function* deletePackageSaga() {
    while (true) {
        const {
            payload: { id },
        } = yield take(DELETE_PACKAGE);
        try {
            yield call(
                fetchAPI,
                'DELETE',
                `managers/packages/${id}`,
                void 0,
                void 0,
                {
                    handleErrorInternally: true,
                },
            );
        } catch ({ response, status }) {
            yield put(addError({ response, status }));

            continue;
        }

        yield put(fetchPackages());
    }
}

export function* saga() {
    yield all([ call(fetchPackagesSaga), call(updatePackageSaga), call(createPackageSaga), call(deletePackageSaga) ]);
}
