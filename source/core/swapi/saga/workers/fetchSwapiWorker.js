import { call, put } from 'redux-saga/effects';

import { swapiActions } from 'core/swapi/actions';
import { uiActions } from 'core/ui/actions';

// import { authenticateWorker } from 'core/auth/saga/workers';
import { authActions } from 'core/auth/actions';

import nprogress from 'nprogress';

import fetchAPI from 'utils/api';

export function* fetchSwapiWorker() {
    try {
        yield nprogress.start();
        yield put(uiActions.setSwapiFetchingState(true));

        const response = yield call(fetchAPI, 'GET', 'orders', { page: 1 });

        const swapi = yield call([ response, response.json ]);
        yield put(swapiActions.fetchSwapiSuccess(swapi));
    } catch (error) {
        yield put(swapiActions.fetchSwapiFail(error));
    } finally {
        yield put(uiActions.setSwapiFetchingState(false));
        yield nprogress.done();
    }
}
