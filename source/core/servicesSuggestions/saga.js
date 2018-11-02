// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setServicesFetchingState } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchServicesSuggestionsSuccess } from './duck';

import { FETCH_SERVICES_SUGGESTIONS } from './duck';

export function* fetchServicesSaga() {
    while (true) {
        try {
            yield take(FETCH_SERVICES_SUGGESTIONS);
            yield put(setServicesFetchingState(true));

            const data = yield call(
                fetchAPI,
                'GET',
                'services/parts/suggestions',
                // filters,
            );

            yield put(fetchServicesSuggestionsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setServicesFetchingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchServicesSaga) ]);
}
