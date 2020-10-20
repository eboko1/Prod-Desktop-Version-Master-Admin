// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';

//proj
import { fetchAPI } from 'utils';

// own
import { fetchStorageSuccess, fetchStorageFail } from './duck';

import { FETCH_STORAGE } from './duck';

export function* fetchStorageSaga({ payload: type }) {
    alert(FETCH_STORAGE);
    try {
        yield nprogress.start();

        const data = yield call(fetchAPI, 'GET', '/store_docs', {
            type: 'INCOME',
        });
        console.log(data);

        yield put(fetchStorageSuccess(data));
    } catch (error) {
        yield put(fetchStorageFail(error));
    } finally {
        yield nprogress.done();
    }
}

export function* saga() {
    yield all([ takeEvery(FETCH_STORAGE, fetchStorageSaga) ]);
}
