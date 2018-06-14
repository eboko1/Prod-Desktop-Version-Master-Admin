// Core
import { takeEvery } from 'redux-saga/effects';

// Instruments
import types from 'core/intl/types';
import { updateIntlWorker } from './workers';

export default Object.freeze({
    *updateIntlWatcher() {
        yield takeEvery(types.UPDATE_INTL, updateIntlWorker);
    },
});
