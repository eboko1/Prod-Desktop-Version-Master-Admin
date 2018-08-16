// Core
import { put } from 'redux-saga/effects';
import nprogress from 'nprogress';

// Proj
import { emitError } from 'core/ui/duck';
import { intlActions } from 'core/intl/actions';
import { setLocale } from 'utils';
import { intl } from 'store/intl';
// import { locale, messages } from 'store/intl';

export function* initIntlWorker() {
    try {
        yield nprogress.start();

        yield setLocale(intl.locale);

        yield put(intlActions.initIntlSuccess(intl));
    } catch (error) {
        yield put(emitError(error));
    } finally {
        yield nprogress.done();
    }
}
