// vendor
import { call, put, all, take, select, takeEvery } from 'redux-saga/effects';

//proj
import { emitError, setBusinessPackageFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchBusinessPackages,
    fetchBusinessPackagesSuccess,
    fetchBusinessPackagesError,
    addError,
} from './duck';

import { FETCH_BUSINESS_PACKAGES, SET_PAGE, SET_SORT } from './duck';

export function* setPageSaga() {
    yield put(fetchBusinessPackages());
}

export function* setSortSaga() {
    yield put(fetchBusinessPackages());
}

export function* fetchBusinessPackagesSaga() {
    while (true) {
        try {
            yield take(FETCH_BUSINESS_PACKAGES);
            const getParams = yield select(state => ({
                sort: {
                    ...state.businessPackage.sort,
                    page: state.businessPackage.page,
                },
            }));

            yield put(setBusinessPackageFetchingState(true));

            const data = yield call(
                fetchAPI,
                'GET',
                'managers/businesses/packages',
                getParams,
            );

            yield put(fetchBusinessPackagesSuccess(data));
        } catch (error) {
            yield put(emitError(error));
            yield put(fetchBusinessPackagesError());
        } finally {
            yield put(setBusinessPackageFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchBusinessPackagesSaga), takeEvery(SET_SORT, setSortSaga), takeEvery(SET_PAGE, setPageSaga) ]);
}
