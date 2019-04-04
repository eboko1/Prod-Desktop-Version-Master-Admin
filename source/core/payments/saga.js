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
    subscribeError,
    FETCH_SUBSCRIPTION_PRODUCTS,
    FETCH_SUBSCRIPTION_PACKAGES,
    FETCH_SUBSCRIPTION_SUGGESTIONS,
    SUBSCRIBE,
    SUBSCRIPTION_TYPES,
    VERIFY_PROMO_CODE,
    verifyPromoCodeSuccess,
    verifyPromoCodeError,
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
            const packages = yield select(selectSubscriptionPackages);
            const filters = {
                ...packages.filters,
            };

            const response = yield call(fetchAPI, 'GET', '/subscriptions', {
                type:     SUBSCRIPTION_TYPES.ROLES_PACKAGE,
                pageSize: 10,
                ...filters,
            });

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
            const suggestions = yield select(selectSubscriptionSuggestions);
            const filters = {
                ...suggestions.filters,
            };
            const response = yield call(fetchAPI, 'GET', '/subscriptions', {
                type:     SUBSCRIPTION_TYPES.SUGGESTION_GROUP,
                pageSize: 10,
                ...filters,
            });
            yield put(fetchSubscriptionSuggestionsSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* verifyPromoCodeSaga() {
    while (true) {
        try {
            const { payload } = yield take(VERIFY_PROMO_CODE);
            const response = yield call(
                fetchAPI,
                'GET',
                `/promo_codes/${payload}`,
                null,
                null,
                { handleErrorInternally: true },
            );
            yield put(verifyPromoCodeSuccess(response.discountPercent));
        } catch (error) {
            yield put(verifyPromoCodeError('error'));
            // yield put(emitError(error));
        }
    }
}

// export function* subscribeSaga() {
//     while (true) {
//         try {
//             const { payload } = yield take(SUBSCRIBE);
//             yield call(fetchAPI, 'POST', '/subscriptions', null, payload);
//             yield put(subscribeSuccess());
//         } catch (error) {
//             yield put(subscribeError());
//         }
//     }
// }

export function* saga() {
    yield all([
        call(fetchSubscriptionProductsSaga),
        call(fetchSubscriptionPackagesSaga),
        call(fetchSubscriptionSuggestionsSaga),
        // call(subscribeSaga),
        call(verifyPromoCodeSaga),
    ]);
}
