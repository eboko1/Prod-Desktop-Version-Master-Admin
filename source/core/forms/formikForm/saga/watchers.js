import { takeEvery } from 'redux-saga/effects';

import types from '../types';
import { formikFormWorker } from './workers';

export default Object.freeze({
    *formikFormWatcher() {
        yield takeEvery(types.SET_FIRST_NAME, formikFormWorker);
    },
});
