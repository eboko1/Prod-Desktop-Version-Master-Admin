import { takeEvery } from 'redux-saga/effects';

import types from 'core/swapi/types';

import { fetchSwapiWorker } from './workers';

export default Object.freeze({
    *fetchSwapiWatcher() {
        yield takeEvery(types.FETCH_SWAPI, fetchSwapiWorker);
    },
});
