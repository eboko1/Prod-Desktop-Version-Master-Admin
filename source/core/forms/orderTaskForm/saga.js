// vendor
import { call, put, all, take } from 'redux-saga/effects';
// import nprogress from 'nprogress';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
import moment from 'moment';
// own
import { saveOrderTaskSuccess, SAVE_ORDER_TASK } from './duck';
import { fetchOrderTask } from 'core/forms/orderForm/duck';
import { fetchMyTasks } from 'core/myTasks/duck';

export function* saveNewOrderTask() {
    while (true) {
        try {
            const { payload, id, taskId, myTasks } = yield take(
                SAVE_ORDER_TASK,
            );
            let obj = {
                comment:       payload.comment.value,
                priority:      payload.priority.value,
                responsibleId: payload.responsible.value,
                status:        payload.status.value,
                stationNum:    payload.stationName.value,
            };
            if (payload.deadlineDate.value) {
                obj.deadlineDate = moment(
                    `${moment(payload.deadlineDate.value).format(
                        'YYYY-MM-DD',
                    )} ${moment(payload.deadlineTime.value).format('HH:mm')}`,
                ).format();
            }
            let data;
            if (!taskId) {
                data = yield call(
                    fetchAPI,
                    'POST',
                    `orders/${id}/tasks`,
                    null,
                    obj,
                );
            } else {
                data = yield call(
                    fetchAPI,
                    'PUT',
                    `/orders/tasks/${taskId}`,
                    null,
                    obj,
                );
            }

            yield put(saveOrderTaskSuccess(data));
            if (myTasks) {
                yield put(fetchMyTasks());
            } else {
                yield put(fetchOrderTask(id));
            }
        } catch (error) {
            yield put(emitError(error));
        }
    }
}
export function* saga() {
    yield all([ call(saveNewOrderTask) ]);
}
