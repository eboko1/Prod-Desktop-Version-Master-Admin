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
                comment:       payload.comment,
                priority:      payload.priority,
                responsibleId: payload.responsible,
                status:        payload.status,
                stationNum:    payload.stationName,
            };
            if (payload.deadlineDate) {
                obj.deadlineDate = moment(
                    `${moment(payload.deadlineDate).format(
                        'YYYY-MM-DD',
                    )} ${payload.deadlineTime?moment(payload.deadlineTime).format('HH:mm'):'00:00'}`,
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
