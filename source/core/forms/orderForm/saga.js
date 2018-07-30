// vendor
import {
    call,
    put,
    all,
    take,
    takeLatest,
    delay,
    takeEvery,
    select,
} from 'redux-saga/effects';
import { replace } from 'react-router-redux';
// import nprogress from 'nprogress';

//proj
import { resetModal, MODALS } from 'core/modals/duck';
import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';
import book from 'routes/book';

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
    returnToOrdersPage,
    createInviteOrderSuccess,

    CREATE_INVITE_ORDER,
    FETCH_ORDER_FORM,
    FETCH_ADD_ORDER_FORM,
    ON_CHANGE_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    ON_SERVICE_SEARCH,
    ON_DETAIL_SEARCH,
    ON_BRAND_SEARCH,
    CREATE_ORDER,
    UPDATE_ORDER,
    RETURN_TO_ORDERS_PAGE,
} from './duck';
import nprogress from "nprogress"

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

const selectModal = state => state.modals.modal;

export function* updateOrderSaga() {
    while (true) {
        const {
            payload: { order, id, redirectStatus },
        } = yield take(UPDATE_ORDER);
        yield call(fetchAPI, 'PUT', `orders/${id}`, {}, order);
        yield put(updateOrderSuccess());

        if (!redirectStatus) {
            yield put(fetchOrderForm(id));
        }
        const modal = yield select(selectModal);
        if (
            modal === MODALS.CANCEL_REASON ||
            modal === MODALS.TO_SUCCESS ||
            modal === MODALS.CONFIRM_EXIT
        ) {
            yield put(resetModal());
        }
        if (redirectStatus) {
            yield put(returnToOrdersPage(redirectStatus));
        }
    }
}

export function* returnToOrdersPageSaga() {
    while (true) {
        const { payload: status } = yield take(RETURN_TO_ORDERS_PAGE);
        const statusesMap = [
            {
                route:    '/orders/appointments',
                statuses: [ 'not_complete', 'required', 'call' ],
            },
            { route: '/orders/approve', statuses: [ 'approve', 'reserve' ] },
            { route: '/orders/in-progress', statuses: [ 'progress' ] },
            { route: '/orders/success', statuses: [ 'success' ] },
            { route: '/orders/reviews', statuses: [ 'review' ] },
            { route: '/orders/invitations', statuses: [ 'invite' ] },
            { route: '/orders/cancel', statuses: [ 'cancel' ] },
        ];
        const config = statusesMap.find(({ statuses }) =>
            statuses.includes(status));
        const { route = '/orders/appointments' } = config || {};
        yield put(replace(route));
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
        yield put(uiActions.setOrderFetchingState(true));
        const data = yield call(fetchAPI, 'GET', 'orders/form');

        yield put(fetchAddOrderFormSuccess(data));
        yield put(uiActions.setOrderFetchingState(false));
    }
}

export function* createInviteOrderSaga({ payload: invite }) {
    yield nprogress.start();
    const data = yield call(fetchAPI, 'POST', 'orders', null, invite);

    yield put(createInviteOrderSuccess(data));
    yield nprogress.done();

    const id = yield select(state => state.forms.orderForm.order.id);
    yield put(fetchOrderForm(id));
}

export function* saga() {
    yield all([ takeEvery(CREATE_INVITE_ORDER, createInviteOrderSaga), call(returnToOrdersPageSaga), call(updateOrderSaga), call(createOrderSaga), call(fetchAddOrderFormSaga), call(fetchOrderFormSaga), call(onChangeOrderFormSaga), takeLatest(ON_SERVICE_SEARCH, handleServiceSearch), takeLatest(ON_BRAND_SEARCH, handleBrandSearch), takeLatest(ON_DETAIL_SEARCH, handleDetailSearch), takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga) ]);
}
