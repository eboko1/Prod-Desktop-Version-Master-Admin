// vendor
// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

/**
 * Constants
 **/
export const moduleName = 'price_groups';
const prefix = `cpb/${moduleName}`;

export const FETCH_PRICE_GROUPS = `${prefix}/FETCH_PRICE_GROUPS`;
export const FETCH_PRICE_GROUPS_SUCCESS = `${prefix}/FETCH_PRICE_GROUPS_SUCCESS`;

export const CREATE_PRICE_GROUP = `${prefix}/CREATE_PRICE_GROUP`;
export const CREATE_PRICE_GROUP_SUCCESS = `${prefix}/CREATE_PRICE_GROUP_SUCCESS`;
export const UPDATE_PRICE_GROUP = `${prefix}/UPDATE_PRICE_GROUP`;
export const UPDATE_PRICE_GROUP_SUCCESS = `${prefix}/UPDATE_PRICE_GROUP_SUCCESS`;
export const DELETE_PRICE_GROUP = `${prefix}/DELETE_PRICE_GROUP`;
export const DELETE_PRICE_GROUP_SUCCESS = `${prefix}/DELETE_PRICE_GROUP_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    priceGroups: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_PRICE_GROUPS_SUCCESS:
            return { ...state, priceGroups: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectPriceGroups = state => stateSelector(state).priceGroups;

/**
 * Action Creators
 **/

// priceGroups
export const fetchPriceGroups = () => ({
    type: FETCH_PRICE_GROUPS,
});

export const fetchPriceGroupsSuccess = priceGroups => ({
    type:    FETCH_PRICE_GROUPS_SUCCESS,
    payload: priceGroups,
});

export const createPriceGroup = priceGroup => ({
    type:    CREATE_PRICE_GROUP,
    payload: priceGroup,
});

export const createPriceGroupSuccess = () => ({
    type: CREATE_PRICE_GROUP_SUCCESS,
});

export const updatePriceGroup = priceGroup => ({
    type:    UPDATE_PRICE_GROUP,
    payload: priceGroup,
});

export const updatePriceGroupSuccess = () => ({
    type: UPDATE_PRICE_GROUP_SUCCESS,
});

export const deletePriceGroup = priceGroup => ({
    type:    DELETE_PRICE_GROUP,
    payload: priceGroup,
});

export const deletePriceGroupSuccess = () => ({
    type: DELETE_PRICE_GROUP_SUCCESS,
});

/**
 * Sagas
 **/

export function* fetchPriceGroupsSaga() {
    while (true) {
        try {
            yield take(FETCH_PRICE_GROUPS);
            yield nprogress.start();

            const data = yield call(fetchAPI, 'GET', 'price_groups');

            yield put(fetchPriceGroupsSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* createPriceGroupSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_PRICE_GROUP);
            yield nprogress.start();

            yield call(fetchAPI, 'POST', 'price_groups', null, payload);

            yield put(createPriceGroupSuccess());
            yield put(fetchPriceGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* updatePriceGroupSaga() {
    while (true) {
        try {
            const { payload } = yield take(UPDATE_PRICE_GROUP);
            yield nprogress.start();

            yield call(
                fetchAPI,
                'PUT',
                `price_groups/${payload.number}`,
                null,
                _.omit(payload, [ 'businessId', 'number' ]),
            );

            yield put(updatePriceGroupSuccess());
            yield put(fetchPriceGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* deletePriceGroupSaga() {
    while (true) {
        try {
            const { payload: number } = yield take(DELETE_PRICE_GROUP);
            yield nprogress.start();

            yield call(fetchAPI, 'DELETE', `price_groups/${number}`);

            yield put(deletePriceGroupSuccess());
            yield put(fetchPriceGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchPriceGroupsSaga),
        call(createPriceGroupSaga),
        call(updatePriceGroupSaga),
        call(deletePriceGroupSaga),
    ]);
}
