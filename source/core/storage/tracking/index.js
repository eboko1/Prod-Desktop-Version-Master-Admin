// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import moment from 'moment';
import { push } from 'connected-react-router';

//proj
import { setStoreProductsSearchQuery } from 'core/search/duck';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import book from 'routes/book';
/**
 * Constants
 **/
export const moduleName = 'tracking';
const prefix = `cbp/${moduleName}`;

export const FETCH_TRACKING = `${prefix}/FETCH_TRACKING`;
export const FETCH_TRACKING_SUCCESS = `${prefix}/FETCH_TRACKING_SUCCESS`;

export const SET_TRACKING_LOADING = `${prefix}/SET_TRACKING_LOADING`;
export const SET_TRACKING_FILTERS = `${prefix}/SET_TRACKING_FILTERS`;
export const REDIRECT_TO_TRACKING = `${prefix}/REDIRECT_TO_TRACKING`;
export const SET_TRACKING_PAGE = `${prefix}/SET_TRACKING_PAGE`;

/**
 * Reducer
 **/

const ReducerState = {
    tracking: {
        stats: {
            count: '0',
        },
        list: [],
    },
    trackingLoading: false,
    filters:         {
        page:      1,
        startDate: moment().subtract(30, 'days'),
        endDate:   moment(),
        productId: void 0,
        showOnlyOrders: false,
        showOnlyReserves: false,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_TRACKING_SUCCESS:
            return { ...state, tracking: { ...payload } };

        case SET_TRACKING_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_TRACKING_FILTERS:
            return {
                ...state,
                filters: { ...state.filters, ...payload, page: 1 },
            };

        case SET_TRACKING_LOADING:
            return { ...state, trackingLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectTracking = state => stateSelector(state).tracking;
export const selectTrackingFilters = state => stateSelector(state).filters;
export const selectTrackingLoading = state =>
    stateSelector(state).trackingLoading;

/**
 * Action Creators
 **/

export const fetchTracking = () => ({
    type: FETCH_TRACKING,
});

export const fetchTrackingSuccess = tracking => ({
    type:    FETCH_TRACKING_SUCCESS,
    payload: tracking,
});

export const setTrackingPage = page => ({
    type:    SET_TRACKING_PAGE,
    payload: page,
});

export const setTrackingFilters = filters => ({
    type:    SET_TRACKING_FILTERS,
    payload: filters,
});

export const redirectToTracking = filters => ({
    type:    REDIRECT_TO_TRACKING,
    payload: filters,
});

export const setTrackingLoading = isLoading => ({
    type:    SET_TRACKING_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

export function* fetchTrackingSaga() {
    while (true) {
        try {
            const { payload } = yield take([ FETCH_TRACKING, SET_TRACKING_FILTERS ]);
            yield put(setTrackingLoading(true));
            const filters = yield select(selectTrackingFilters);
            if(payload.showOnlyReserves) {
                const response = yield call(
                    fetchAPI,
                    'GET',
                    '/store_doc_products/reserve',
                    {
                        productId: filters.productId,
                    },
                );
                yield put(fetchTrackingSuccess(response));
            } else {
                const response = yield call(
                    fetchAPI,
                    'GET',
                    '/store_doc_products',
                    {
                        ...filters,
                        startDate: moment(filters.startDate).format('YYYY-MM-DD'),
                        endDate:   moment(filters.endDate).format('YYYY-MM-DD'),
                    },
                );
                yield put(fetchTrackingSuccess(response));
            }
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setTrackingLoading(false));
        }
    }
}

export function* redirectToTrackingSaga() {
    while (true) {
        try {
            const { payload } = yield take(REDIRECT_TO_TRACKING);
            yield put(push({
                pathname: book.productsTracking,
                type: payload.type,
            }));
            yield put(setTrackingFilters({
                productId: payload.id,
                showOnlyOrders: payload.type == "orders",
                showOnlyReserves: payload.type == "reserves",
            }));
            yield put(setStoreProductsSearchQuery(payload.code));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchTrackingSaga), call(redirectToTrackingSaga) ]);
}
