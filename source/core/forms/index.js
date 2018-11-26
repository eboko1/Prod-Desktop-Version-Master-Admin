// vendor
import { combineReducers } from 'redux';

// own
import orderReducer, { moduleName as order } from './orderForm/duck';
import loginReducer, { moduleName as login } from './loginForm/duck';

import addPackageReducer, {
    moduleName as addPackage,
} from './addPackageForm/duck';
import addBusinessPackageReducer, {
    moduleName as addBusinessPackage,
} from './addBusinessPackageForm/duck';
import businessPackageReducer, {
    moduleName as businessPackage,
} from './businessPackageForm/duck';
import editPackageReducer, {
    moduleName as editPackage,
} from './editPackageForm/duck';
import brandsReducer, { moduleName as brands } from './brandsForm/duck';

import addRoleReducer, { moduleName as addRole } from './addRoleForm/duck';
import editRoleReducer, { moduleName as editRole } from './editRoleForm/duck';

import addClientVehicleReducer, {
    moduleName as addClientVehicle,
} from './addClientVehicleForm/duck';
import editClientVehicleReducer, {
    moduleName as editClientVehicle,
} from './editClientVehicleForm/duck';

import addClientRequisiteReducer, {
    moduleName as addClientRequisite,
} from './addClientRequisiteForm/duck';
import editClientRequisiteReducer, {
    moduleName as editClientRequisite,
} from './editClientRequisiteForm/duck';

import salaryReportReducer, {
    moduleName as salaryReport,
} from './salaryReportForm/duck';

import switchBusinessReducer, {
    moduleName as switchBusiness,
} from './switchBusinessForm/duck';

import universalFiltersReducer, {
    moduleName as universalFilters,
} from './universalFiltersForm/duck';

import addClientReducer, {
    moduleName as addClient,
} from './addClientForm/duck';

import cancelReasonReducer, {
    moduleName as cancelReason,
} from './cancelReasonForm/duck';

import toSuccessReducer, {
    moduleName as toSuccess,
} from './toSuccessForm/duck';

import orderTaskReducer, {
    moduleName as orderTask,
} from './orderTaskForm/duck';
import employeeFormReducer, {
    moduleName as employeeFormModule,
} from 'core/forms/employeeForm/duck';

import scheduleFormReducer, {
    moduleName as scheduleFormModule,
} from 'core/forms/scheduleForm/duck';

import breakScheduleFormReducer, {
    moduleName as breakScheduleFormModule,
} from 'core/forms/breakScheduleForm/duck';

import managerRoleReducer, {
    moduleName as managerRole,
} from './managerRoleForm/duck';

import tecDocReducer, { moduleName as tecDoc } from './tecDocForm/duck';

import settingSalaryReducer, {
    moduleName as settingSalary,
} from './settingSalaryForm/duck';

import profileReducer, {
    moduleName as profile,
} from 'core/forms/profileForm/duck';

import editClientReducer, {
    moduleName as editClient,
} from 'core/forms/editClientForm/duck';

import servicesReducer, {
    moduleName as services,
} from 'core/forms/servicesForm/duck';

import setDetailProductReducer, {
    moduleName as setDetailProduct,
} from 'core/forms/setDetailProduct/duck';

import spreadBusinessBrandsReducer, {
    moduleName as spreadBusinessBrands,
} from 'core/forms/spreadBusinessBrands/duck';

// combine all forms reducers to forms reducer in store
export const formsReducer = combineReducers({
    [ spreadBusinessBrands ]:    spreadBusinessBrandsReducer,
    [ setDetailProduct ]:        setDetailProductReducer,
    [ addBusinessPackage ]:      addBusinessPackageReducer,
    [ addClient ]:               addClientReducer,
    [ addClientRequisite ]:      addClientRequisiteReducer,
    [ addClientVehicle ]:        addClientVehicleReducer,
    [ addPackage ]:              addPackageReducer,
    [ addRole ]:                 addRoleReducer,
    [ breakScheduleFormModule ]: breakScheduleFormReducer,
    [ businessPackage ]:         businessPackageReducer,
    [ cancelReason ]:            cancelReasonReducer,
    [ editClient ]:              editClientReducer,
    [ editClientRequisite ]:     editClientRequisiteReducer,
    [ editClientVehicle ]:       editClientVehicleReducer,
    [ editPackage ]:             editPackageReducer,
    [ editRole ]:                editRoleReducer,
    [ employeeFormModule ]:      employeeFormReducer,
    [ login ]:                   loginReducer,
    [ managerRole ]:             managerRoleReducer,
    [ order ]:                   orderReducer,
    [ orderTask ]:               orderTaskReducer,
    [ profile ]:                 profileReducer,
    [ salaryReport ]:            salaryReportReducer,
    [ scheduleFormModule ]:      scheduleFormReducer,
    [ services ]:                servicesReducer,
    [ settingSalary ]:           settingSalaryReducer,
    [ switchBusiness ]:          switchBusinessReducer,
    [ tecDoc ]:                  tecDocReducer,
    [ toSuccess ]:               toSuccessReducer,
    [ universalFilters ]:        universalFiltersReducer,
    [ brands ]:                  brandsReducer,
});
