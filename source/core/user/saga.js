// vendor
// import { all, call, put, take } from 'redux-saga/effects';
//
// // own
// import { emitError } from 'core/ui/duck';
// import { setUser, SET_USER } from './duck';
//
// export function* setUserSaga() {
//     while (true) {
//         try {
//             const { payload: user } = yield take(SET_USER);
//
//             yield put(setUser(user));
//         } catch (error) {
//             yield put(emitError(error));
//         }
//     }
// }
//
// export function* saga() {
//     yield all([ call(setUserSaga) ]);
// }
