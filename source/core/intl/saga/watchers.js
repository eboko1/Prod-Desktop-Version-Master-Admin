// Core
import { takeEvery } from 'redux-saga/effects';

// Instruments
import types from 'core/intl/types';
import { updateIntlWorker, initIntlWorker } from './workers';

export default Object.freeze({
    *initIntlWatcher() {
        yield takeEvery(types.INIT_INTL, initIntlWorker);
    },
    *updateIntlWatcher() {
        yield takeEvery(types.UPDATE_INTL, updateIntlWorker);
    },
});
