// vendor
import { all } from 'redux-saga/effects';

//own
// global
import intl from 'core/intl/saga/watchers';
import { saga as authSaga } from 'core/auth/saga';
import { saga as uiSaga } from 'core/ui/saga';
import { saga as subscriptionSaga } from 'core/subscription/saga';

// core
import { saga as myTasksContainerSaga } from 'core/myTasks/saga';
import { saga as packagesSaga } from 'core/package/saga';
import { saga as businessPackageSaga } from 'core/businessPackage/saga';
import { saga as managerRoleSaga } from 'core/managerRole/saga';
import { saga as rolesSaga } from 'core/role/saga';
import { saga as clientSaga } from 'core/client/saga';
import { saga as clientRequisitesSaga } from 'core/clientRequisite/saga';
import { saga as clientOrdersSaga } from 'core/clientOrders/saga';
import { saga as clientMRDsSaga } from 'core/clientMRDs/saga';
import { saga as clientHotOperationsSaga } from 'core/clientHotOperations/saga';
import { saga as employeesSaga } from 'core/employees/saga';
import { saga as vehicleTypesSaga } from 'core/vehicleTypes/saga';
import { saga as vehiclesSaga } from 'core/vehicles/saga';

// Reports
import { saga as reportOrdersSaga } from 'core/reports/reportOrders/saga';
import { saga as reportClientDebtsSaga } from 'core/reports/reportClientDebts/saga';
import { saga as reportLoadKPISaga } from 'core/reports/reportLoadKPI/saga';
import { saga as reportAnalyticsSaga } from 'core/reports/reportAnalytics/saga';
import { saga as reportCashFlowSaga } from 'core/reports/reportCashFlow/saga';
import { saga as reportCashOrdersLogsSaga } from 'core/reports/reportCashOrdersLogs/saga';

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
import { saga as paymentsSaga } from 'core/payments/saga';
import { saga as warehousesSaga } from 'core/warehouses/saga';
import { saga as brandsSaga } from 'core/brands/saga';

// forms
import { saga as loginFormSaga } from 'core/forms/loginForm/saga';
import { saga as universalFiltersFormSaga } from 'core/forms/universalFiltersForm/saga';
import { saga as orderTaskFormSaga } from 'core/forms/orderTaskForm/saga';
import { saga as orderFormSaga } from 'core/forms/orderForm/saga';
import { saga as addClientFormSaga } from 'core/forms/addClientForm/saga';
import { saga as reportAnalyticsFormSaga } from 'core/forms/reportAnalyticsForm/saga'
import { saga as switchBusinessSaga } from 'core/forms/switchBusinessForm/saga';
import { saga as addClientVehicleSaga } from 'core/forms/addClientVehicleForm/saga';
import { saga as employeeFormSaga } from 'core/forms/employeeForm/saga';
import { saga as scheduleFormSaga } from 'core/forms/scheduleForm/saga';
import { saga as profileFormSaga } from 'core/forms/profileForm/saga';
import { saga as editClientFormSaga } from 'core/forms/editClientForm/saga';
import { saga as settingSalaryFormSaga } from 'core/forms/settingSalaryForm/saga';
import { saga as tecDocFormSaga } from 'core/forms/tecDocForm/saga';
import { saga as servicesFormSaga } from 'core/forms/servicesForm/saga';
import { saga as brandsFormSaga } from 'core/forms/brandsForm/saga';
import { saga as setDetailProductSaga } from 'core/forms/setDetailProduct/saga';
import { saga as spreadBusinessSaga } from 'core/forms/spreadBusinessBrands/saga';
import { saga as cashOrderFormSaga } from 'core/forms/cashOrderForm/saga';


// storage
import { saga as storageStoreGroupsSaga } from 'core/storage/storeGroups';
import { saga as storagePriceGroupsSaga } from 'core/storage/priceGroups';
import { saga as storageProductsSaga } from 'core/storage/products';
import { saga as storageIncomesSaga } from 'core/storage/incomes';
import { saga as storageExpensesSaga } from 'core/storage/expenses';
import { saga as storageTrackingSaga } from 'core/storage/tracking';
import { saga as storageBalanceSaga } from 'core/storage/storeBalance';
import { saga as storageMovementSaga } from 'core/storage/storeMovement';

/* eslint-disable array-element-newline */
export default function* rootSaga() {
    yield all([
        // global
        intl.updateIntlWatcher(),
        authSaga(),
        uiSaga(),
        subscriptionSaga(),
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
        clientMRDsSaga(),
        clientHotOperationsSaga(),
        vehicleTypesSaga(),
        vehiclesSaga(),

        // Reports
        reportOrdersSaga(),
        reportAnalyticsSaga(),
        reportAnalyticsFormSaga(),
        reportClientDebtsSaga(),
        reportLoadKPISaga(),
        reportCashFlowSaga(),
        reportCashOrdersLogsSaga(),
        
        clientRequisitesSaga(),
        orderTaskFormSaga(),
        employeesSaga(),
        employeeFormSaga(),
        employeeScheduleSaga(),
        scheduleFormSaga(),
        settingSalaryFormSaga(),
        suppliersSaga(),
        warehousesSaga(),
        brandsSaga(),
        // storage
        storageStoreGroupsSaga(),
        storagePriceGroupsSaga(),
        storageProductsSaga(),
        storageIncomesSaga(),
        storageExpensesSaga(),
        storageTrackingSaga(),
        storageBalanceSaga(),
        storageMovementSaga(),
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
        paymentsSaga(),
        // administration
        servicesFormSaga(),
        servicesSuggestions(),
        brandsFormSaga(),
        vehicleNumberHistorySaga(),
        setDetailProductSaga(),
        spreadBusinessSaga(),
    ]);
}
/* eslint-enable array-element-newline */
