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
import { saga as employeeScheduleSaga } from 'core/employeeSchedule/saga';
import { saga as chartSaga } from 'core/chart/saga';
import { saga as reviewsSaga } from 'core/reviews/saga';
import { saga as reviewSaga } from 'core/review/saga';
import { saga as callsSaga } from 'core/calls/saga';
import { saga as tecDocActionsSaga } from 'core/tecDocActions/saga';
import { saga as servicesSuggestions } from 'core/servicesSuggestions/saga';
import { saga as vehicleNumberHistorySaga } from 'core/vehicleNumberHistory/saga';
import { saga as cashSaga } from 'core/cash/saga';
import { saga as suppliersSaga } from 'core/suppliers/saga';
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
import { saga as scheduleFormSaga } from 'core/forms/scheduleForm/saga';
import { saga as profileFormSaga } from 'core/forms/profileForm/saga';
import { saga as editClientFormSaga } from 'core/forms/editClientForm/saga';
import { saga as settingSalaryFormSaga } from 'core/forms/settingSalaryForm/saga';
import { saga as tecDocFormSaga } from 'core/forms/tecDocForm/saga';
import { saga as servicesFormSaga } from 'core/forms/servicesForm/saga';
import { saga as brandsSaga } from 'core/forms/brandsForm/saga';
import { saga as setDetailProductSaga } from 'core/forms/setDetailProduct/saga';
import { saga as spreadBusinessSaga } from 'core/forms/spreadBusinessBrands/saga';
import { saga as cashOrderFormSaga } from 'core/forms/cashOrderForm/saga';

/* eslint-disable array-element-newline */
export default function* rootSaga() {
    yield all([
        // global
        intl.updateIntlWatcher(),
        authSaga(),
        uiSaga(),
        // login
        loginFormSaga(),
        // commons
        universalFiltersFormSaga(),
        profileFormSaga(),
        switchBusinessSaga(),
        searchSaga(),
        addClientVehicleSaga(),
        //
        // operations
        dashboardSaga(),
        ordersSaga(),
        orderSaga(),
        orderFormSaga(),
        myTasksContainerSaga(),
        // reference book
        clientsSaga(),
        clientSaga(),
        addClientFormSaga(),
        editClientFormSaga(),
        clientOrdersSaga(),
        clientRequisitesSaga(),
        orderTaskFormSaga(),
        employeesSaga(),
        employeeFormSaga(),
        employeeScheduleSaga(),
        scheduleFormSaga(),
        settingSalaryFormSaga(),
        suppliersSaga(),
        // cash
        cashSaga(),
        cashOrderFormSaga(),
        // statistics
        chartSaga(),
        reviewsSaga(),
        reviewSaga(),
        callsSaga(),
        // settings
        packagesSaga(),
        rolesSaga(),
        businessPackageSaga(),
        managerRoleSaga(),
        tecDocFormSaga(),
        tecDocActionsSaga(),
        // administration
        servicesFormSaga(),
        servicesSuggestions(),
        brandsSaga(),
        vehicleNumberHistorySaga(),
        setDetailProductSaga(),
        spreadBusinessSaga(),
    ]);
}
/* eslint-enable array-element-newline */
