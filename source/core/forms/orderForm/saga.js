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
import { replace } from 'react-router-redux';
// import nprogress from 'nprogress';

//proj
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import {
    fetchOrderFormSuccess,
    fetchAddOrderFormSuccess,
    fetchOrderForm,
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    onHandleCustomService,
    onHandleCustomDetail,
    onHandleCustomBrand,
    createOrderSuccess,
    updateOrderSuccess,
    FETCH_ORDER_FORM,
    FETCH_ADD_ORDER_FORM,
    ON_CHANGE_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_SERVICE_SEARCH,
    ON_DETAIL_SEARCH,
    ON_BRAND_SEARCH,
    CREATE_ORDER,
    UPDATE_ORDER,
} from './duck';

export function* fetchOrderFormSaga() {
    while (true) {
        const { payload: id } = yield take(FETCH_ORDER_FORM);
        yield put(uiActions.setOrderFetchingState(true));
        const data = yield call(fetchAPI, 'GET', `orders/${id}`);

        yield put(fetchOrderFormSuccess(data));
        yield put(uiActions.setOrderFetchingState(false));
    }
}

export function* createOrderSaga() {
    while (true) {
        const { payload: entity } = yield take(CREATE_ORDER);
        yield call(fetchAPI, 'POST', 'orders', {}, entity);
        yield put(createOrderSuccess());
        yield put(replace('/orders/appointments'));
    }
}

export function* updateOrderSaga() {
    while (true) {
        const {
            payload: { order, id },
        } = yield take(UPDATE_ORDER);
        yield call(fetchAPI, 'PUT', `orders/${id}`, {}, order);
        yield put(updateOrderSuccess());
        yield put(fetchOrderForm(id));
        // yield put(replace('/orders/appointments'));
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

function* handleServiceSearch({ payload }) {
    yield delay(200);
    yield put(onHandleCustomService(payload));
}

function* handleDetailSearch({ payload }) {
    yield delay(200);
    yield put(onHandleCustomDetail(payload));
}

function* handleBrandSearch({ payload }) {
    yield delay(200);
    yield put(onHandleCustomBrand(payload));
}

export function* fetchAddOrderFormSaga() {
    while (true) {
        yield take(FETCH_ADD_ORDER_FORM);
        const data = yield call(fetchAPI, 'GET', 'orders/form');

        yield put(fetchAddOrderFormSuccess(data));
    }
}

export function* saga() {
    yield all([ call(updateOrderSaga), call(createOrderSaga), call(fetchAddOrderFormSaga), call(fetchOrderFormSaga), call(onChangeOrderFormSaga), takeLatest(ON_SERVICE_SEARCH, handleServiceSearch), takeLatest(ON_BRAND_SEARCH, handleBrandSearch), takeLatest(ON_DETAIL_SEARCH, handleDetailSearch), takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga) ]);
}
