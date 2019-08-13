// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { emitError, setSuggestionsFetching } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchServicesSuggestionsSuccess, selectFilters } from './duck';
import { FETCH_SERVICES_SUGGESTIONS } from './duck';

export function* fetchServicesSaga() {
    while (true) {
        try {
            yield take(FETCH_SERVICES_SUGGESTIONS);
            yield nprogress.start();

            const filters = yield select(selectFilters);

            const data = yield call(
                fetchAPI,
                'GET',
                'services/parts/suggestions',
                filters,
            );
            yield put(fetchServicesSuggestionsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([ call(fetchServicesSaga) ]);
}
