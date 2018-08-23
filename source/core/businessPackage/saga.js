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
import { emitError, setBusinessPackageFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchBusinessPackages,
    fetchBusinessPackagesSuccess,
    fetchBusinessPackagesError,
    fetchBusinessesSuccess,
    setIsFetchingBusinesses,
    addError,
    hideForms,
} from './duck';

import {
    CREATE_BUSINESS_PACKAGE,
    UPDATE_BUSINESS_PACKAGE,
    FETCH_BUSINESS_PACKAGES,
    SET_PAGE,
    SET_SORT,
    SET_FILTERS,
    SET_BUSINESS_SEARCH_QUERY,
} from './duck';

export function* refetchBusinessPackagesSaga() {
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
                filters: {
                    ...state.businessPackage.filters,
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

function* handleBusinessesSearchSaga({ payload: query }) {
    yield delay(1000);

    if (query && query.length > 2) {
        yield put(setIsFetchingBusinesses(true));
        const businesses = yield call(fetchAPI, 'GET', 'businesses/search', {
            search: query,
        });
        yield put(fetchBusinessesSuccess(businesses));
        yield put(setIsFetchingBusinesses(false));
    }
}

function* createBusinessPackageSaga({
    payload: { businessId, packageId, datetimeRange },
}) {
    const entity = {
        businessId,
        rolePackages: [{ rolePackageId: packageId, ...datetimeRange }],
    };

    yield call(fetchAPI, 'POST', 'managers/packages/assign', null, entity);

    yield put(hideForms());
    yield put(fetchBusinessPackages());
}

function* updateBusinessPackageSaga({
    payload: { businessPackageId, datetimeRange },
}) {
    const entity = { ...datetimeRange };

    yield call(fetchAPI, 'PUT', `/managers/businesses/packages/${businessPackageId}`, null, entity);

    yield put(hideForms());
    yield put(fetchBusinessPackages());
}

export function* saga() {
    yield all([
        takeLatest(SET_BUSINESS_SEARCH_QUERY, handleBusinessesSearchSaga),
        call(fetchBusinessPackagesSaga),
        takeEvery(CREATE_BUSINESS_PACKAGE, createBusinessPackageSaga),
        takeEvery(UPDATE_BUSINESS_PACKAGE, updateBusinessPackageSaga),
        takeEvery(
            [ SET_FILTERS, SET_SORT, SET_PAGE ],
            refetchBusinessPackagesSaga,
        ),
    ]);
}
