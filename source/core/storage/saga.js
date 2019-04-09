// //vendor
// import { all, call, put, take } from 'redux-saga/effects';

// // proj
// import { setHeaderFetchingState } from 'core/ui/duck';

// import { getCookie, setCookie, fetchAPI } from 'utils';

// // own
// import { productsExcelImportSuccess, PRODUCTS_EXCEL_IMPORT } from './duck';

// export function* headerDataSaga() {
//     while (true) {
//         try {
//             const { payload: file } = yield take(PRODUCTS_EXCEL_IMPORT);

//             yield put(productsExcelImportSuccess(file));
//         } catch (error) {
//             throw new Error(error);
//         }
//     }
// }

// export function* saga() {
//     yield all([ call(headerDataSaga) ]);
// }
