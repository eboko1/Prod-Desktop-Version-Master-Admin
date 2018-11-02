// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setServicesFetchingState } from 'core/ui/duck';
import { fetchServicesSuggestions } from 'core/servicesSuggestions/duck';
import { fetchAPI } from 'utils';

import { CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from './duck';

export function* updateServiceSaga() {
    while (true) {
        const {
            payload: { id, suggestion },
        } = yield take(UPDATE_SERVICE);
        yield call(
            fetchAPI,
            'GET',
            `services/parts/suggestions${id}`,
            // filters,
            null,
            suggestion,
        );

        yield put(fetchServicesSuggestions());
    }
}

export function* createServiceSaga() {
    while (true) {
        const { payload: suggestion } = yield take(CREATE_SERVICE);
        console.log('* createServiceSaga', suggestion);
        yield call(
            fetchAPI,
            'POST',
            'services/parts/suggestions',
            null,
            suggestion,
        );

        yield put(fetchServicesSuggestions());
    }
}

export function* deleteServiceSaga() {
    while (true) {
        const { payload: suggestionId } = yield take(DELETE_SERVICE);
        yield call(
            fetchAPI,
            'DELETE',
            `services/parts/suggestions/${suggestionId}`,
        );

        yield put(fetchServicesSuggestions());
    }
}

export function* saga() {
    yield all([ call(updateServiceSaga), call(createServiceSaga), call(deleteServiceSaga) ]);
}
