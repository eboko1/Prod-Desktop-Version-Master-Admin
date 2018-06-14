import { takeEvery } from 'redux-saga/effects';

import types from 'core/auth/types';
import { loginWorker, logoutWorker } from './workers';

export default Object.freeze({
    *loginWatcher() {
        yield takeEvery(types.LOGIN, loginWorker);
    },
    *logoutWatcher() {
        yield takeEvery(types.LOGOUT, logoutWorker);
    },
});
