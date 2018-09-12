// vendor
import { all } from 'redux-saga/effects';

//own
// global
import intl from 'core/intl/saga/watchers';
import { saga as authSaga } from 'core/auth/saga';
import { saga as uiSaga } from 'core/ui/saga';
// containers
import { saga as dashboardSaga } from 'core/dashboard/saga';
import { saga as ordersSaga } from 'core/orders/saga';
import { saga as orderSaga } from 'core/order/saga';
import { saga as searchSaga } from 'core/search/saga';
import { saga as clientsSaga } from 'core/clients/saga';
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
import { saga as clientSaga } from 'core/client/saga';
import { saga as clientRequisitesSaga } from 'core/clientRequisite/saga';
import { saga as clientOrdersSaga } from 'core/clientOrders/saga';
import { saga as switchBusinessSaga } from 'core/forms/switchBusinessForm/saga';
import { saga as addClientVehicleSaga } from 'core/forms/addClientVehicleForm/saga';
import { saga as employeesSaga } from 'core/employees/saga';
import { saga as employeeFormSaga } from 'core/forms/employeeForm/saga';
import { saga as employeeScheduleFormSaga } from 'core/forms/employeeScheduleForm/saga';
import { saga as employeeBreakScheduleFormSaga } from 'core/forms/employeeBreakScheduleForm/saga';
import { saga as profileFormSaga } from 'core/forms/profileForm/saga';
import { saga as editClientFormSaga } from 'core/forms/editClientForm/saga';

/* eslint-disable array-element-newline */
export default function* rootSaga() {
    yield all([
        intl.updateIntlWatcher(),
        authSaga(),
        uiSaga(),
        ordersSaga(),
        orderSaga(),
        clientsSaga(),
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
        employeesSaga(),
        employeeFormSaga(),
        businessPackageSaga(),
        employeeScheduleFormSaga(),
        employeeBreakScheduleFormSaga(),
        searchSaga(),
        managerRoleSaga(),
        profileFormSaga(),
        clientSaga(),
        addClientVehicleSaga(),
        editClientFormSaga(),
        clientRequisitesSaga(),
        clientOrdersSaga(),
    ]);
}
/* eslint-enable array-element-newline */
