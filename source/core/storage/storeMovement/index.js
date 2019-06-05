// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

/**
 * Constants
 **/
export const moduleName = 'store_movement';
const prefix = `cbp/${moduleName}`;

export const FETCH_STORE_MOVEMENT = `${prefix}/FETCH_STORE_MOVEMENT`;
export const FETCH_STORE_MOVEMENT_SUCCESS = `${prefix}/FETCH_STORE_MOVEMENT_SUCCESS`;

export const SET_STORE_MOVEMENT_PAGE = `${prefix}/SET_STORE_MOVEMENT_PAGE`;
export const SET_STORE_MOVEMENT_FILTERS = `${prefix}/SET_STORE_MOVEMENT_FILTERS`;
export const SET_STORE_MOVEMENT_LOADING = `${prefix}/SET_STORE_MOVEMENT_LOADING`;

/**
 * Reducer
 **/

const ReducerState = {
    movement: {
        total: {},
        stats: {
            count: '0',
        },
        list: [],
    },
    storeMovementLoading: false,
    filters:              {
        page:      1,
        startDate: moment().subtract(30, 'days'),
        endDate:   moment(),
        productId: void 0,
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_MOVEMENT_SUCCESS:
            return { ...state, movement: payload };

        case SET_STORE_MOVEMENT_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_STORE_MOVEMENT_FILTERS:
            return {
                ...state,
                filters: { ...payload, page: state.filters.page },
            };

        case SET_STORE_MOVEMENT_LOADING:
            return { ...state, storeMovementLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreMovement = state => stateSelector(state).movement;
export const selectStoreMovementTotal = state =>
    _.get(stateSelector(state), 'movement.total');
export const selectStoreMovementFilters = state => stateSelector(state).filters;
export const selectStoreMovementLoading = state =>
    stateSelector(state).storeMovementLoading;

/**
 * Action Creators
 **/

export const fetchStoreMovement = () => ({
    type: FETCH_STORE_MOVEMENT,
});

export const fetchStoreMovementSuccess = storeMovement => ({
    type:    FETCH_STORE_MOVEMENT_SUCCESS,
    payload: storeMovement,
});

export const setStoreMovementPage = page => ({
    type:    SET_STORE_MOVEMENT_PAGE,
    payload: page,
});

export const setStoreMovementFilters = filters => ({
    type:    SET_STORE_MOVEMENT_FILTERS,
    payload: filters,
});

export const setStoreMovementLoading = isLoading => ({
    type:    SET_STORE_MOVEMENT_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 **/

export function* fetchStoreMovementSaga() {
    while (true) {
        try {
            yield take([ FETCH_STORE_MOVEMENT, SET_STORE_MOVEMENT_FILTERS ]);
            yield put(setStoreMovementLoading(true));
            const filters = yield select(selectStoreMovementFilters);
            const response = yield call(
                fetchAPI,
                'GET',
                '/store_doc_products/movement',
                {
                    ...filters,
                    startDate: moment(filters.startDate).format('YYYY-MM-DD'),
                    endDate:   moment(filters.endDate).format('YYYY-MM-DD'),
                },
            );
            yield put(fetchStoreMovementSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setStoreMovementLoading(false));
        }
    }
}

export function* saga() {
    yield all([ call(fetchStoreMovementSaga) ]);
}
