import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nprogress from 'nprogress';

import { setFirstName } from '../../actions';
// import { SET_NAME } from '../types';

export function* formikFormWorker({
    payload: { name },
    meta: { setSubmitting, setErrors },
}) {
    try {
        yield nprogress.start();
        yield put(setFirstName({ firstName: null }));
        yield delay(500);
        const response = yield call(
            fetch,
            `https://swapi.co/api/people/${name}/?format=json`,
            {
                method: 'GET',
            },
        );
        yield put(setFirstName({ firstName: response.data.name }));
    } catch (error) {
        setErrors({ name: error.response.data.message });
    } finally {
        setSubmitting(false);
        yield nprogress.done();
    }
}
