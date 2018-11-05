// vendor
import { call, put, all, take } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import {
    emitError,
    setServicesFetchingState,
    setSuggestionsLoading,
} from 'core/ui/duck';
import { fetchServicesSuggestions } from 'core/servicesSuggestions/duck';
import { fetchAPI } from 'utils';

import { CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from './duck';

export function* updateServiceSaga() {
    while (true) {
        try {
            const { payload: suggestion } = yield take(UPDATE_SERVICE);
            yield put(setSuggestionsLoading(true));
            yield call(
                fetchAPI,
                'PUT',
                `services/parts/suggestions/${suggestion.suggestionId}`,
                // filters,
                null,
                _.pick(suggestion, [ 'serviceId', 'detailId', 'quantity' ]),
            );
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setSuggestionsLoading(false));
            yield put(fetchServicesSuggestions());
        }
    }
}

export function* createServiceSaga() {
    while (true) {
        try {
            const { payload: suggestion } = yield take(CREATE_SERVICE);
            yield put(setSuggestionsLoading(true));
            yield call(
                fetchAPI,
                'POST',
                'services/parts/suggestions',
                null,
                suggestion,
            );
        } catch (error) {
            yield emitError(error);
        }
        yield put(setSuggestionsLoading(false));
        yield put(fetchServicesSuggestions());
    }
}

export function* deleteServiceSaga() {
    while (true) {
        try {
            const { payload: suggestionId } = yield take(DELETE_SERVICE);
            yield put(setSuggestionsLoading(true));

            yield call(
                fetchAPI,
                'DELETE',
                `services/parts/suggestions/${suggestionId}`,
            );
        } catch (error) {
            yield emitError(error);
        } finally {
            yield put(setSuggestionsLoading(false));
            yield put(fetchServicesSuggestions());
        }
    }
}

export function* saga() {
    yield all([ call(updateServiceSaga), call(createServiceSaga), call(deleteServiceSaga) ]);
}
