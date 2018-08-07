// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
// import { uiActions } from 'core/ui/actions';
import { fetchAPI } from 'utils';

// own
import { saveOrderTaskSuccess, SAVE_ORDER_TASK } from './duck';

export function* saveNewOrderTask() {
    while (true) {
        const { payload, id } = yield take(SAVE_ORDER_TASK);
        let obj={comment:        payload.comment.value,
            responsibleId:  720,
            'status':       'CALL',
            'stationNum':   1,
            'deadlineDate': '2018-08-09T14:06:42.780Z',
        }
        const data = yield call(fetchAPI, 'POST', `orders/${id}/tasks`, null, obj );
        yield put(saveOrderTaskSuccess(data));
    }
}
export function* saga() {
    yield all([ call(saveNewOrderTask) ]);
}
// TODO:
// 1) import orderTasksForm actions and action-types
// 2) add saga watcher and workers
// 3) don't forget to connect watcher-saga in 'store/rootSaga'
