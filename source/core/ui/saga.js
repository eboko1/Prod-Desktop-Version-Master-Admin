import { takeEvery } from 'redux-saga/effects';

import types from './types';

import { setCollapsedState } from 'utils';

export function* layoutCollapsedWorker({ payload: state }) {
    try {
        yield setCollapsedState(state);
    } catch (error) {
        throw new Error(error);
    }
}

export default Object.freeze({
    *layoutCollapsedWatcher() {
        yield takeEvery(types.SET_COLLAPSED_STATE, layoutCollapsedWorker);
    },
});
