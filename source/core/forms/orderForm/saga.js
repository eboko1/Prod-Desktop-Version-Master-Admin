// vendor
import {call, put, all, take, takeLatest, delay, takeEvery} from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrderFormSuccess,
    onChangeClientSearchQuery,
    onChangeClientSearchQuerySuccess,
    FETCH_ORDER_FORM,
    ON_CHANGE_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_CLIENT_SELECT,
} from './duck';
import {FETCH_ORDER} from "../../order/duck";

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

function* handleInput({payload}) {
    yield delay(3000);

    if (payload.length > 2) {
        const data = yield call(fetchAPI, 'GET', 'clients', {query: payload});
        yield put(onChangeClientSearchQuerySuccess(data));
    } else {
        yield put(onChangeClientSearchQuerySuccess([]));
    }
}

function* watchInput() {
    // will cancel current running handleInput task
    yield takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleInput);
}

export function* saga() {
    yield all([ call(fetchOrderFormSaga), call(watchInput), call(onChangeOrderFormSaga) ]);
}
