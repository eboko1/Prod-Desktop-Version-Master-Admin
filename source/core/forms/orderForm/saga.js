// vendor
import {
    call,
    put,
    all,
    take,
    takeLatest,
    delay,
    takeEvery,
} from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrderFormSuccess,
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    FETCH_ORDER_FORM,
    ON_CHANGE_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
} from './duck';

export function* fetchOrderFormSaga() {
    while (true) {
        const { payload: id } = yield take(FETCH_ORDER_FORM);
        const data = yield call(fetchAPI, 'GET', `orders/${id}`);

        yield put(fetchOrderFormSuccess(data));
    }
}

export function* onChangeOrderFormSaga() {
    while (true) {
        const {
            meta: { form, field },
            payload,
        } = yield take(ON_CHANGE_ORDER_FORM);
        if (field === 'searchClientQuery') {
            yield put(onChangeClientSearchQuery(payload[ field ].value));
        }
    }
}

function* handleClientSearchSaga({ payload }) {
    yield put(onChangeClientSearchQueryRequest());
    yield delay(1000);

    if (payload.length > 2) {
        const data = yield call(fetchAPI, 'GET', 'clients', { query: payload });
        yield put(onChangeClientSearchQuerySuccess(data));
    } else {
        yield put(onChangeClientSearchQuerySuccess([]));
    }
}

export function* saga() {
    yield all([ call(fetchOrderFormSaga), call(onChangeOrderFormSaga), takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga) ]);
}
