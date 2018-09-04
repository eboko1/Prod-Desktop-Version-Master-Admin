// vendor
import { call, put, all, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';

//proj
import { intlActions } from 'core/intl/actions';
import { updateUser } from 'core/auth/duck';
import { setProfileUpdatingState, emitError } from 'core/ui/duck';
import { setIntl } from 'store/intl';
import { fetchAPI } from 'utils';
import book from 'routes/book';

// own
import { submitProfileFormSuccess, SUBMIT_PROFILE_FORM } from './duck';

export function* submitProfileFormSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(SUBMIT_PROFILE_FORM);
            yield put(setProfileUpdatingState(true));

            yield call(fetchAPI, 'PUT', '/managers', null, user);

            yield put(updateUser(user));

            if (user.language) {
                const intl = yield setIntl(user.language);
                yield put(intlActions.updateIntl(intl));
            }
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield put(submitProfileFormSuccess());
            yield put(replace(book.profile));
            yield put(setProfileUpdatingState(false));
        }
    }
}

export function* saga() {
    yield all([ call(submitProfileFormSaga) ]);
}
