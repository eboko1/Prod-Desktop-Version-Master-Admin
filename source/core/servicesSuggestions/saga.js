// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { emitError, setSuggestionsFetching } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import { fetchServicesSuggestionsSuccess } from './duck';

import { FETCH_SERVICES_SUGGESTIONS } from './duck';

export function* fetchServicesSaga() {
    while (true) {
        try {
            yield take(FETCH_SERVICES_SUGGESTIONS);
            yield put(setSuggestionsFetching(true));

            const data = yield call(
                fetchAPI,
                'GET',
                'services/parts/suggestions',
                // filters,
            );
            // const dataSource = data.servicesPartsSuggestions.list.map(
            //     suggestion => {
            //         // console.log('→ key', `${suggestion.serviceId}-${index}`);
            //
            //         // return {
            //         //     ...suggestion,
            //         //     key: `${suggestion.serviceId}-${index}`,
            //         // };
            //         const data = suggestion.details.map(item => ({
            //             ...item,
            //             key: item.suggestionId,
            //         }));
            //
            //         return { ...suggestion, details: data };
            //     },
            // );
            // data.servicesPartsSuggestions.list = dataSource;
            yield put(fetchServicesSuggestionsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setSuggestionsFetching(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchServicesSaga) ]);
}
