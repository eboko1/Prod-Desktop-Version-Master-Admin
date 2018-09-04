// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import nprogress from 'nprogress';
import _ from 'lodash';

//proj
import { updateUser } from 'core/auth/duck';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own

import {
    submitProfileFormSuccess,
    SUBMIT_PROFILE_FORM,
    // profileFieldsSelector,
} from './duck';

export function* submitProfileFormSaga() {
    while (true) {
        try {
            const { payload: user } = yield take(SUBMIT_PROFILE_FORM);
            yield nprogress.start();
            console.log('→ user', user);
            yield call(fetchAPI, 'PUT', '/managers', null, user);
            // console.log('* profileFields', profileFields);
            yield put(updateUser(user));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
            yield put(submitProfileFormSuccess());
        }
    }
}

export function* saga() {
    yield all([ call(submitProfileFormSaga) ]);
}
