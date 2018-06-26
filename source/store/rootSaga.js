import { all } from 'redux-saga/effects';

import swapi from 'core/swapi/saga/watchers';
import auth from 'core/auth/saga/watchers';
import intl from 'core/intl/saga/watchers';
import ui from 'core/ui/saga';

import { saga as ordersSaga } from 'core/orders/saga';
import { saga as orderSaga } from 'core/order/saga';
import { saga as addOrderSaga } from 'core/addOrder/saga';

import { saga as universalFiltersFormSaga } from 'core/forms/universalFiltersForm/saga';
import { saga as addOrderFormSaga } from 'core/forms/addOrderForm/saga';

// import formikForm from 'core/forms/formikForm/saga/watchers';

export default function* rootSaga() {
    yield all([ auth.loginWatcher(), auth.logoutWatcher(), swapi.fetchSwapiWatcher(), intl.updateIntlWatcher(), ui.layoutCollapsedWatcher(), ordersSaga(), orderSaga(), addOrderSaga(), universalFiltersFormSaga(), addOrderFormSaga() ]);
}
// formikForm.formikFormWatcher()
