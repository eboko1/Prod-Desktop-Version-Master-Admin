//vendor
import { all, call, put, take, select } from 'redux-saga/effects';

// proj
import { emitError } from 'core/ui/duck';

import { fetchAPI } from 'utils';

// own
import {
    fetchSubscriptionProductsSuccess,
    fetchSubscriptionPackagesSuccess,
    fetchSubscriptionSuggestionsSuccess,
    subscribeSuccess,
    FETCH_SUBSCRIPTION_PRODUCTS,
    FETCH_SUBSCRIPTION_PACKAGES,
    FETCH_SUBSCRIPTION_SUGGESTIONS,
    SUBSCRIBE,
    SUBSCRIPTION_TYPES,
    selectSubscriptionPackages,
    selectSubscriptionSuggestions,
} from './duck';

export function* fetchSubscriptionProductsSaga() {
    while (true) {
        try {
            const { payload: type } = yield take(FETCH_SUBSCRIPTION_PRODUCTS);

            const response = yield call(fetchAPI, 'GET', '/products', { type });

            yield put(fetchSubscriptionProductsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSubscriptionPackagesSaga() {
    while (true) {
        try {
            yield take(FETCH_SUBSCRIPTION_PACKAGES);
            console.log('→ 11');
            const packages = yield select(selectSubscriptionPackages);

            console.log('* 11filters', packages);
            const response = yield call(fetchAPI, 'GET', '/subscriptions', {
                type:     SUBSCRIPTION_TYPES.ROLES_PACKAGE,
                pageSize: 10,
                ...packages.filters,
            });
            console.log('→ 111response', response);
            yield put(fetchSubscriptionPackagesSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* fetchSubscriptionSuggestionsSaga() {
    while (true) {
        try {
            yield take(FETCH_SUBSCRIPTION_SUGGESTIONS);
            console.log('→ 222');
            const suggestions = yield select(selectSubscriptionSuggestions);

            const response = yield call(fetchAPI, 'GET', '/subscriptions', {
                type:     SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
                pageSize: 10,
                ...suggestions.filters,
            });
            console.log('→ 222response', response);
            yield put(fetchSubscriptionSuggestionsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* subscribeSaga() {
    while (true) {
        try {
            const { payload } = yield take(SUBSCRIBE);
            yield call(fetchAPI, 'POST', '/subscriptions', null, payload);
            yield put(subscribeSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([
        call(fetchSubscriptionProductsSaga),
        call(fetchSubscriptionPackagesSaga),
        call(fetchSubscriptionSuggestionsSaga),
        call(subscribeSaga),
    ]);
}
