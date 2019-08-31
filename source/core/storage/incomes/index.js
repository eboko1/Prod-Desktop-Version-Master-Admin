// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import _ from 'lodash';
//proj
import { emitError } from 'core/ui/duck';
import { setErrorMessage } from 'core/errorMessage/duck';
import { fetchAPI } from 'utils';

import book from 'routes/book';

/**
 * Constants
 **/
export const moduleName = 'incomes';
const prefix = `cbp/${moduleName}`;

export const FETCH_INCOMES = `${prefix}/FETCH_INCOMES`;
export const FETCH_INCOMES_SUCCESS = `${prefix}/FETCH_INCOMES_SUCCESS`;

export const SET_INCOMES_PAGE = `${prefix}/SET_INCOMES_PAGE`;
export const SET_INCOMES_FILERS = `${prefix}/SET_INCOMES_FILERS`;

export const SET_INCOMES_LOADING = `${prefix}/SET_INCOMES_LOADING`;

export const FETCH_INCOME_DOC = `${prefix}/FETCH_INCOME_DOC`;
export const FETCH_INCOME_DOC_SUCCESS = `${prefix}/FETCH_INCOME_DOC_SUCCESS`;
export const CREATE_INCOME_DOC = `${prefix}/CREATE_INCOME_DOC`;
export const CREATE_INCOME_DOC_SUCCESS = `${prefix}/CREATE_INCOME_DOC_SUCCESS`;
export const UPDATE_INCOME_DOC = `${prefix}/UPDATE_INCOME_DOC`;
export const UPDATE_INCOME_DOC_SUCCESS = `${prefix}/UPDATE_INCOME_DOC_SUCCESS`;
export const DELETE_INCOME_DOC = `${prefix}/DELETE_INCOME_DOC`;
export const DELETE_INCOME_DOC_SUCCESS = `${prefix}/DELETE_INCOME_DOC_SUCCESS`;

export const SET_INCOME_DOC_LOADING = `${prefix}/SET_INCOME_DOC_LOADING`;
/**
 * Reducer
 **/

const ReducerState = {
    // incomes:   { stats: { count: '0' }, list: [] },
    incomes:   {},
    incomeDoc: {},
    filters:   {
        supplierId:      null,
        createdDatetime: void 0,
        recordDatetime:  void 0,
        doneDatetime:    void 0,
        paidDatetime:    void 0,
        status:          null,
        page:            1,
    },
    incomesLoading:   false,
    incomeDocLoading: false,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_INCOMES_SUCCESS:
            return { ...state, incomes: payload };

        case FETCH_INCOME_DOC_SUCCESS:
            return { ...state, incomeDoc: payload };

        case SET_INCOMES_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_INCOMES_FILERS:
            return {
                ...state,
                filters: { ...state.filters, ...payload, page: 1 },
            };

        case SET_INCOMES_LOADING:
            return { ...state, incomesLoading: payload };

        case SET_INCOME_DOC_LOADING:
            return { ...state, incomeDocLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectIncomes = state => stateSelector(state).incomes;
export const selectIncomesFilters = state => stateSelector(state).filters;
export const selectIncomeDoc = state => stateSelector(state).incomeDoc;

export const selectIncomesLoading = state =>
    stateSelector(state).incomesLoading;
export const selectIncomeDocLoading = state =>
    stateSelector(state).incomeDocLoading;

/**
 * Action Creators
 **/

export const fetchIncomes = () => ({
    type: FETCH_INCOMES,
});

export const fetchIncomesSuccess = incomes => ({
    type:    FETCH_INCOMES_SUCCESS,
    payload: incomes,
});

export const setIncomesPage = page => ({
    type:    SET_INCOMES_PAGE,
    payload: page,
});

export const setIncomesFilters = filters => ({
    type:    SET_INCOMES_FILERS,
    payload: filters,
});

export const fetchIncomeDoc = id => ({
    type:    FETCH_INCOME_DOC,
    payload: id,
});

export const fetchIncomeDocSuccess = incomeDoc => ({
    type:    FETCH_INCOME_DOC_SUCCESS,
    payload: incomeDoc,
});

export const createIncomeDoc = incomeDoc => ({
    type:    CREATE_INCOME_DOC,
    payload: incomeDoc,
});

export const createIncomeDocSuccess = () => ({
    type: CREATE_INCOME_DOC_SUCCESS,
});

export const updateIncomeDoc = (id, incomeDoc) => ({
    type:    UPDATE_INCOME_DOC,
    payload: { id, incomeDoc },
});

export const updateIncomeDocSuccess = () => ({
    type: UPDATE_INCOME_DOC_SUCCESS,
});

export const deleteIncomeDoc = incomeDoc => ({
    type:    DELETE_INCOME_DOC,
    payload: incomeDoc,
});

export const deleteIncomeDocSuccess = () => ({
    type: DELETE_INCOME_DOC_SUCCESS,
});

export const setIncomesLoading = isLoading => ({
    type:    SET_INCOMES_LOADING,
    payload: isLoading,
});
export const setIncomeDocLoading = isLoading => ({
    type:    SET_INCOME_DOC_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 */

export function* fetchIncomesSaga() {
    while (true) {
        try {
            yield take([ FETCH_INCOMES, SET_INCOMES_FILERS ]);
            yield put(setIncomesLoading(true));
            const filters = yield select(selectIncomesFilters);

            const response = yield call(fetchAPI, 'GET', '/store_docs', {
                type: 'INCOME',
                ...filters,
                ...filters.createdDatetime
                    ? {
                        createdDatetime: filters.createdDatetime.format(
                            'YYYY-MM-DD',
                        ),
                    }
                    : {},
                ...filters.recordDatetime
                    ? {
                        recordDatetime: filters.recordDatetime.format(
                            'YYYY-MM-DD',
                        ),
                    }
                    : {},
                ...filters.doneDatetime
                    ? {
                        doneDatetime: filters.doneDatetime.format(
                            'YYYY-MM-DD',
                        ),
                    }
                    : {},
                ...filters.paidDatetime
                    ? {
                        paidDatetime: filters.paidDatetime.format(
                            'YYYY-MM-DD',
                        ),
                    }
                    : {},
            });

            yield put(fetchIncomesSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setIncomesLoading(false));
        }
    }
}

export function* fetchIncomeDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_INCOME_DOC);
            yield put(setIncomeDocLoading(true));

            const response = yield call(
                fetchAPI,
                'GET',
                `/store_docs/INCOME/${payload}`,
            );

            yield put(fetchIncomeDocSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setIncomeDocLoading(false));
        }
    }
}

export function* createIncomeDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_INCOME_DOC);
            yield put(setIncomeDocLoading(true));
            const response = yield call(fetchAPI, 'POST', '/store_docs', null, {
                type: 'INCOME',
                ...payload,
            });
            yield put(fetchIncomeDocSuccess(response));
            yield put(push(`${book.storageIncomes}`));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setIncomeDocLoading(false));
        }
    }
}

export function* updateIncomeDocSaga() {
    while (true) {
        try {
            const {
                payload: { id, incomeDoc },
            } = yield take(UPDATE_INCOME_DOC);
            yield put(setIncomeDocLoading(true));
            yield call(fetchAPI, 'PUT', `/store_docs/${id}`, null, {
                type: 'INCOME',
                ...incomeDoc,
            });
            yield put(updateIncomeDocSuccess());
            yield put(push(`${book.storageIncomes}`));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setIncomeDocLoading(false));
        }
    }
}

export function* deleteIncomeDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(DELETE_INCOME_DOC);
            yield call(
                fetchAPI,
                'DELETE',
                `/store_docs/INCOME/${payload}`,
                null,
                null,
                {
                    handleErrorInternally: true,
                },
            );
            yield put(deleteIncomeDocSuccess());
        } catch (error) {
            yield put(setErrorMessage(error));
        }
    }
}

export function* saga() {
    yield all([
        call(fetchIncomesSaga),
        call(fetchIncomeDocSaga),
        call(createIncomeDocSaga),
        call(updateIncomeDocSaga),
        call(deleteIncomeDocSaga),
    ]);
}
