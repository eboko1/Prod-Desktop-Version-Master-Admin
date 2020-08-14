// vendor
import { call, put, all, take } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { resetModal } from 'core/modals/duck';
import { onChangeOrderForm } from 'core/forms/orderForm/duck';
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';

// own
import {
    fetchAddClientFormSuccess,
    createClientSuccess,
    addError,
    FETCH_ADD_CLIENT_FORM,
    CREATE_CLIENT,
} from './duck';

export function* fetchAddClientFormSaga() {
    while (true) {
        try {
            yield take(FETCH_ADD_CLIENT_FORM);
            const data = yield call(fetchAPI, 'GET', 'vehicles_info');

            yield put(fetchAddClientFormSuccess(data));
        } catch (error) {
            yield put(emitError(error));
        }
    }
}

export function* createClientSaga() {
    while (true) {
        const { payload } = yield take(CREATE_CLIENT);
        try {
            yield call(fetchAPI, 'POST', 'clients', null, payload, {
                handleErrorInternally: true,
            });
        } catch ({ response, status }) {
            yield put(addError({ response, status }));

            continue;
        }

        yield put(createClientSuccess());
        const actionData = {
            fields: {
                searchClientQuery: {
                    touched: true,
                    dirty:   false,
                    value:   _.first(payload.phones),
                    name:    'searchClientQuery',
                },
            },
            meta: { form: 'orderForm', field: 'searchClientQuery' },
        };
        yield put(onChangeOrderForm(actionData.fields, actionData.meta));
        yield put(resetModal());
    }
}
/* eslint-disable array-element-newline */
export function* saga() {
    yield all([ call(fetchAddClientFormSaga), call(createClientSaga) ]);
}
/* eslint-enable array-element-newline */
