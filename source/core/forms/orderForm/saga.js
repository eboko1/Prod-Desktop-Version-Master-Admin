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
import _ from 'lodash';
import moment from 'moment';
import nprogress from 'nprogress';

// proj
import { resetModal, MODALS } from 'core/modals/duck';
import {
    setOrderFetchingState,
    setSuggestionsFetchingState,
    setDetailsSuggestionsFetchingState,
    emitError,
} from 'core/ui/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import {
    fetchOrderTaskSuccess,
    fetchOrderFormSuccess,
    fetchAddOrderFormSuccess,
    fetchAvailableHoursSuccess,
    fetchOrderForm,
    fetchAvailableHours,
    onChangeClientSearchQuery,
    onChangeClientSearchQueryRequest,
    onChangeClientSearchQuerySuccess,
    createOrderSuccess,
    updateOrderSuccess,
    returnToOrdersPage,
    createInviteOrderSuccess,
    fetchTecdocSuggestionsSuccess,
    fetchTecdocDetailsSuggestionsSuccess,
    CREATE_INVITE_ORDER,
    FETCH_ORDER_FORM,
    FETCH_ADD_ORDER_FORM,
    FETCH_ORDER_TASK,
    ON_CHANGE_ORDER_FORM,
    ON_CHANGE_CLIENT_SEARCH_QUERY,
    CREATE_ORDER,
    UPDATE_ORDER,
    RETURN_TO_ORDERS_PAGE,
    FETCH_AVAILABLE_HOURS,
    FETCH_TECDOC_SUGGESTIONS,
    FETCH_TECDOC_DETAILS_SUGGESTIONS,
} from './duck';

export function* fetchTecdocDetailsSuggestionsSaga() {
    while (true) {
        const {
            payload: { modificationId, productId, key },
        } = yield take(FETCH_TECDOC_DETAILS_SUGGESTIONS);
        const query = { modificationId, productId };
        yield put(setDetailsSuggestionsFetchingState(true));
        const suggestions = yield call(
            fetchAPI,
            'GET',
            'tecdoc/products/parts/suggest',
            query,
            void 0,
        );
        yield put(fetchTecdocDetailsSuggestionsSuccess(suggestions, key));
        yield put(setDetailsSuggestionsFetchingState(false));
    }
}

export function* fetchTecdocSuggestionsSaga() {
    while (true) {
        const {
            payload: { modificationId, serviceId },
        } = yield take(FETCH_TECDOC_SUGGESTIONS);

        const query = { modificationId, serviceId };

        yield put(setSuggestionsFetchingState(true));
        const suggestions = yield call(
            fetchAPI,
            'GET',
            'tecdoc/suggestions',
            query,
        );
        yield put(fetchTecdocSuggestionsSuccess(suggestions));
        yield put(setSuggestionsFetchingState(false));
    }
}

export function* fetchOrderFormSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(FETCH_ORDER_FORM);
            yield put(setOrderFetchingState(true));

            const data = yield call(fetchAPI, 'GET', `orders/${id}`);

            if (
                _.get(data, 'order.beginDatetime') &&
                _.get(data, 'order.stationNum')
            ) {
                yield put(
                    fetchAvailableHours(
                        data.order.stationNum,
                        moment(data.order.beginDatetime),
                    ),
                );
            }
            yield put(fetchOrderFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setOrderFetchingState(false));
        }
    }
}

export function* fetchOrderTaskSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(FETCH_ORDER_TASK);
            const data = yield call(fetchAPI, 'GET', `orders/${id}/tasks`);

            yield put(fetchOrderTaskSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createOrderSaga() {
    while (true) {
        try {
            const {
                payload: { order, redirectStatus, redirectToDashboard },
            } = yield take(CREATE_ORDER);
            yield call(fetchAPI, 'POST', 'orders', {}, order);
            console.log('* order', order);
            if (redirectToDashboard && redirectStatus) {
                yield put(replace(book.dashboard));
            }

            if (!redirectToDashboard && redirectStatus) {
                yield put(returnToOrdersPage(redirectStatus));
            }
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(createOrderSuccess());
        }
    }
}

const selectModal = state => state.modals.modal;

/* eslint-disable complexity */
export function* updateOrderSaga() {
    while (true) {
        try {
            const {
                payload: {
                    order,
                    id,
                    redirectStatus,
                    redirectToDashboard,
                    options,
                },
            } = yield take(UPDATE_ORDER);
            const mergedOrder = options ? { ...order, ...options } : order;
            yield call(fetchAPI, 'PUT', `orders/${id}`, {}, mergedOrder);

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

            if (redirectToDashboard && redirectStatus) {
                yield put(replace(book.dashboard));
            }

            if (!redirectToDashboard && redirectStatus) {
                yield put(returnToOrdersPage(redirectStatus));
            }
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(updateOrderSuccess());
        }
    }
}

export function* returnToOrdersPageSaga() {
    while (true) {
        try {
            const { payload: status } = yield take(RETURN_TO_ORDERS_PAGE);
            const statusesMap = [
                {
                    route:    '/orders/appointments',
                    statuses: [ 'not_complete', 'required', 'reserve', 'call' ],
                },
                { route: '/orders/approve', statuses: [ 'approve' ] },
                { route: '/orders/progress', statuses: [ 'progress' ] },
                { route: '/orders/success', statuses: [ 'success' ] },
                { route: '/orders/reviews', statuses: [ 'review' ] },
                { route: '/orders/invitations', statuses: [ 'invite' ] },
                { route: '/orders/cancel', statuses: [ 'cancel' ] },
            ];
            const config = statusesMap.find(({ statuses }) =>
                statuses.includes(status));
            const { route = '/orders/appointments' } = config || {};

            yield put(replace(route));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* onChangeOrderFormSaga() {
    while (true) {
        try {
            const {
                meta: { field }, // form
                payload,
            } = yield take(ON_CHANGE_ORDER_FORM);

            if (field === 'searchClientQuery') {
                yield put(onChangeClientSearchQuery(payload[ field ].value));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

function* handleClientSearchSaga({ payload }) {
    try {
        yield put(onChangeClientSearchQueryRequest());
        yield delay(1000);

        if (payload.length > 2) {
            const data = yield call(fetchAPI, 'GET', 'clients/search', {
                query: payload,
            });
            yield put(onChangeClientSearchQuerySuccess(data));
        } else {
            yield put(onChangeClientSearchQuerySuccess([]));
        }
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* fetchAddOrderFormSaga() {
    while (true) {
        try {
            yield take(FETCH_ADD_ORDER_FORM);
            yield put(setOrderFetchingState(true));
            const data = yield call(fetchAPI, 'GET', 'orders/form');

            yield put(fetchAddOrderFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setOrderFetchingState(false));
        }
    }
}

export function* createInviteOrderSaga({ payload: invite }) {
    try {
        yield nprogress.start();
        const data = yield call(fetchAPI, 'POST', 'orders', null, invite);

        yield put(createInviteOrderSuccess(data));
        yield nprogress.done();

        const id = yield select(state => state.forms.orderForm.order.id);
        yield put(fetchOrderForm(id));
    } catch (error) {
        yield put(emitError(error));
    }
}

export function* fetchAvailableHoursSaga() {
    while (true) {
        try {
            const {
                payload: { station, date, orderId },
            } = yield take(FETCH_AVAILABLE_HOURS);
            console.log('* station', station);
            console.log('* date', date);
            console.log('* orderId', orderId);
            const data = yield call(fetchAPI, 'GET', 'dashboard/free_hours', {
                stationNum: station,
                date:       date.toISOString(),
                orderId,
            });
            console.log('* data', data);
            yield put(fetchAvailableHoursSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

/* eslint-disable array-element-newline */
export function* saga() {
    yield all([
        takeEvery(CREATE_INVITE_ORDER, createInviteOrderSaga),
        call(fetchTecdocSuggestionsSaga),
        call(fetchTecdocDetailsSuggestionsSaga),
        call(fetchOrderTaskSaga),
        call(returnToOrdersPageSaga),
        call(updateOrderSaga),
        call(createOrderSaga),
        call(fetchAddOrderFormSaga),
        call(fetchOrderFormSaga),
        call(onChangeOrderFormSaga),
        call(fetchAvailableHoursSaga),
        takeLatest(ON_CHANGE_CLIENT_SEARCH_QUERY, handleClientSearchSaga),
    ]);
}
/* eslint-enable array-element-newline */
