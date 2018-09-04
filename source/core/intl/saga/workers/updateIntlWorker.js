// Core
import { put } from 'redux-saga/effects';
import warning from 'warning';

// Proj
import { intlActions } from 'core/intl/actions';
import { setLocale } from 'utils';

export function* updateIntlWorker({ payload: intl }) {
    try {
        yield setLocale(intl.locale);
        yield put(intlActions.updateIntlSuccess(intl));
    } catch (error) {
        warning(false, 'Error in updateIntlWorker', error.message);
        yield put(intlActions.updateIntlFail(error));
    }
}
