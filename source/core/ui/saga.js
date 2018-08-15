//vendor
import { all, call, take } from 'redux-saga/effects';
// proj
import { setCollapsedState } from 'utils';
// own
import { SET_COLLAPSED_STATE } from './duck';

export function* layoutSaga() {
    while (true) {
        try {
            const { payload: state } = yield take(SET_COLLAPSED_STATE);
            yield setCollapsedState(state);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export function* saga() {
    yield all([ call(layoutSaga) ]);
}
