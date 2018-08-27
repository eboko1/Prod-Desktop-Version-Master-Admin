// vendor
import { all } from 'redux-saga/effects';

//own
// global
import intl from 'core/intl/saga/watchers';
import { saga as authSaga } from 'core/auth/saga';
import { saga as uiSaga } from 'core/ui/saga';
// smart components
import { saga as dashboardSaga } from 'core/dashboard/saga';
import { saga as ordersSaga } from 'core/orders/saga';
import { saga as orderSaga } from 'core/order/saga';
import { saga as searchSaga } from 'core/search/saga';
// forms
import { saga as loginFormSaga } from 'core/forms/loginForm/saga';
import { saga as universalFiltersFormSaga } from 'core/forms/universalFiltersForm/saga';
import { saga as orderTaskFormSaga } from 'core/forms/orderTaskForm/saga';
import { saga as orderFormSaga } from 'core/forms/orderForm/saga';
import { saga as addClientFormSaga } from 'core/forms/addClientForm/saga';
import { saga as myTasksContainerSaga } from 'core/myTasks/saga';
import { saga as packagesSaga } from 'core/package/saga';
import { saga as businessPackageSaga } from 'core/businessPackage/saga';
import { saga as managerRoleSaga } from 'core/managerRole/saga';
import { saga as rolesSaga } from 'core/role/saga';
import { saga as switchBusinessSaga } from 'core/forms/switchBusinessForm/saga';

/* eslint-disable array-element-newline */
export default function* rootSaga() {
    yield all([
        intl.updateIntlWatcher(),
        authSaga(),
        uiSaga(),
        ordersSaga(),
        orderSaga(),
        universalFiltersFormSaga(),
        orderFormSaga(),
        addClientFormSaga(),
        dashboardSaga(),
        loginFormSaga(),
        orderTaskFormSaga(),
        myTasksContainerSaga(),
        packagesSaga(),
        rolesSaga(),
        switchBusinessSaga(),
        businessPackageSaga(),
        searchSaga(),
        managerRoleSaga(),
    ]);
}
/* eslint-enable array-element-newline */
