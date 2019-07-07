// vendor
import { call, put, all, take, select } from 'redux-saga/effects';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

/**
 * Constants
 **/
export const moduleName = 'expenses';
const prefix = `cbp/${moduleName}`;

export const FETCH_EXPENSES = `${prefix}/FETCH_EXPENSES`;
export const FETCH_EXPENSES_SUCCESS = `${prefix}/FETCH_EXPENSES_SUCCESS`;

export const SET_EXPENSES_PAGE = `${prefix}/SET_EXPENSES_PAGE`;
export const SET_EXPENSES_FILTERS = `${prefix}/SET_EXPENSES_FILTERS`;

export const SET_EXPENSES_LOADING = `${prefix}/SET_EXPENSES_LOADING`;

export const FETCH_EXPENSE_DOC = `${prefix}/FETCH_EXPENSE_DOC`;
export const FETCH_EXPENSE_DOC_SUCCESS = `${prefix}/FETCH_EXPENSE_DOC_SUCCESS`;
export const CREATE_EXPENSE_DOC = `${prefix}/CREATE_EXPENSE_DOC`;
export const CREATE_EXPENSE_DOC_SUCCESS = `${prefix}/CREATE_EXPENSE_DOC_SUCCESS`;
export const UPDATE_EXPENSE_DOC = `${prefix}/UPDATE_EXPENSE_DOC`;
export const UPDATE_EXPENSE_DOC_SUCCESS = `${prefix}/UPDATE_EXPENSE_DOC_SUCCESS`;
export const DELETE_EXPENSE_DOC = `${prefix}/DELETE_EXPENSE_DOC`;
export const DELETE_EXPENSE_DOC_SUCCESS = `${prefix}/DELETE_EXPENSE_DOC_SUCCESS`;

export const SET_EXPENSE_DOC_LOADING = `${prefix}/SET_EXPENSE_DOC_LOADING`;
/**
 * Reducer
 **/

const ReducerState = {
    expenses:   { stats: { count: '0' }, list: [] },
    expenseDoc: {},
    filters:    {
        orderDatetime:        void 0,
        orderSuccessDatetime: void 0,
        status:               null,
        page:                 1,
    },
    expensesLoading:   false,
    expenseDocLoading: false,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_EXPENSES_SUCCESS:
            return { ...state, expenses: payload };

        case FETCH_EXPENSE_DOC_SUCCESS:
            return { ...state, expenseDoc: payload };

        case SET_EXPENSES_PAGE:
            return { ...state, filters: { ...state.filters, page: payload } };

        case SET_EXPENSES_FILTERS:
            return { ...state, filters: { ...state.filters, ...payload } };

        case SET_EXPENSES_LOADING:
            return { ...state, expensesLoading: payload };

        case SET_EXPENSE_DOC_LOADING:
            return { ...state, expenseDocLoading: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectExpenses = state => stateSelector(state).expenses;
export const selectExpensesFilters = state => stateSelector(state).filters;
export const selectExpenseDoc = state => stateSelector(state).expenseDoc;

export const selectExpensesLoading = state =>
    stateSelector(state).expensesLoading;
export const selectExpenseDocLoading = state =>
    stateSelector(state).expensesLoading;

/**
 * Action Creators
 **/

export const fetchExpenses = () => ({
    type: FETCH_EXPENSES,
});

export const fetchExpensesSuccess = expenses => ({
    type:    FETCH_EXPENSES_SUCCESS,
    payload: expenses,
});

export const setExpensesPage = page => ({
    type:    SET_EXPENSES_PAGE,
    payload: page,
});

export const setExpensesFilters = filters => ({
    type:    SET_EXPENSES_FILTERS,
    payload: filters,
});

export const fetchExpenseDoc = id => ({
    type:    FETCH_EXPENSE_DOC,
    payload: id,
});

export const fetchExpenseDocSuccess = expenseDoc => ({
    type:    FETCH_EXPENSE_DOC_SUCCESS,
    payload: expenseDoc,
});

export const createExpenseDoc = expenseDoc => ({
    type:    CREATE_EXPENSE_DOC,
    payload: expenseDoc,
});

export const createExpenseDocSuccess = () => ({
    type: CREATE_EXPENSE_DOC_SUCCESS,
});

export const updateExpenseDoc = expenseDoc => ({
    type:    UPDATE_EXPENSE_DOC,
    payload: expenseDoc,
});

export const updateExpenseDocSuccess = () => ({
    type: UPDATE_EXPENSE_DOC_SUCCESS,
});

export const deleteExpenseDoc = expenseDoc => ({
    type:    DELETE_EXPENSE_DOC,
    payload: expenseDoc,
});

export const deleteExpenseDocSuccess = () => ({
    type: DELETE_EXPENSE_DOC_SUCCESS,
});

export const setExpensesLoading = isLoading => ({
    type:    SET_EXPENSES_LOADING,
    payload: isLoading,
});
export const setExpenseDocLoading = isLoading => ({
    type:    SET_EXPENSE_DOC_LOADING,
    payload: isLoading,
});

/**
 * Sagas
 */

export function* fetchExpensesSaga() {
    while (true) {
        try {
            yield take([ FETCH_EXPENSES, SET_EXPENSES_FILTERS ]);
            yield put(setExpensesLoading(true));
            const filters = yield select(selectExpensesFilters);
            const response = yield call(fetchAPI, 'GET', '/store_docs', {
                type: 'EXPENSE',
                ...filters,
            });

            yield put(fetchExpensesSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setExpensesLoading(false));
        }
    }
}

export function* fetchExpenseDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(FETCH_EXPENSE_DOC);
            yield put(setExpenseDocLoading(true));

            const response = yield call(
                fetchAPI,
                'GET',
                `/store_docs/${payload}`,
            );

            yield put(fetchExpenseDocSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setExpenseDocLoading(false));
        }
    }
}

export function* createExpenseDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_EXPENSE_DOC);
            yield put(setExpenseDocLoading(true));
            const response = yield call(
                fetchAPI,
                'POST',
                '/store_docs',
                null,
                payload,
            );
            yield put(fetchExpenseDocSuccess(response));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(setExpenseDocLoading(false));
        }
    }
}

export function* updateExpenseDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(UPDATE_EXPENSE_DOC);
            yield call(
                fetchAPI,
                'PUT',
                `/store_docs/${payload.id}`,
                null,
                payload.product,
            );
            yield put(updateExpenseDocSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* deleteExpenseDocSaga() {
    while (true) {
        try {
            const { payload } = yield take(DELETE_EXPENSE_DOC);
            yield call(fetchAPI, 'DELETE', `/store_docs/${payload}`);
            yield put(deleteExpenseDocSuccess());
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* saga() {
    yield all([
        call(fetchExpensesSaga),
        call(fetchExpenseDocSaga),
        call(createExpenseDocSaga),
        call(updateExpenseDocSaga),
        call(deleteExpenseDocSaga),
    ]);
}
