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
        date:      void 0,
        // date:      moment(),
        productId: void 0,
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
                filters: { ...payload, page: state.filters.page },
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
            yield take([ FETCH_TRACKING, SET_TRACKING_FILTERS ]);
            yield put(setTrackingLoading(true));
            const filters = yield select(selectTrackingFilters);
            const response = yield call(
                fetchAPI,
                'GET',
                '/store_doc_products',
                {
                    ...filters,
                    date: filters.date
                        ? moment(filters.date).format('YYYY-MM-DD')
                        : void 0,
                },
            );

            yield put(fetchTrackingSuccess(response));
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
            console.log('→ REDIRECT payload', payload);
            yield put(push(book.productsTracking));
            yield put(setTrackingFilters({ productId: payload.id }));
            yield put(setStoreProductsSearchQuery(payload.name));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([ call(fetchTrackingSaga), call(redirectToTrackingSaga) ]);
}
