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

import addRoleReducer, { moduleName as addRole } from './addRoleForm/duck';
import editRoleReducer, { moduleName as editRole } from './editRoleForm/duck';

import addClientVehicleReducer, { moduleName as addClientVehicle } from './addClientVehicleForm/duck';
import editClientVehicleReducer, { moduleName as editClientVehicle } from './editClientVehicleForm/duck';

import addClientRequisiteReducer, { moduleName as addClientRequisite } from './addClientRequisiteForm/duck';
import editClientRequisiteReducer, { moduleName as editClientRequisite } from './editClientRequisiteForm/duck';

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

import managerRoleReducer, {
    moduleName as managerRole,
} from './managerRoleForm/duck';

import settingSalaryReducer, {
    moduleName as settingSalary,
} from './settingSalaryForm/duck';

import employeeBreakScheduleFormReducer, {
    moduleName as employeeBreakScheduleFormModule,
} from 'core/forms/employeeBreakScheduleForm/duck';

import profileReducer, {
    moduleName as profile,
} from 'core/forms/profileForm/duck';

import editClientReducer, {
    moduleName as editClient,
} from 'core/forms/editClientForm/duck';

// combine all forms reducers to forms reducer in store
export const formsReducer = combineReducers({
    [ order ]:                           orderReducer,
    [ addClient ]:                       addClientReducer,
    [ universalFilters ]:                universalFiltersReducer,
    [ cancelReason ]:                    cancelReasonReducer,
    [ toSuccess ]:                       toSuccessReducer,
    [ login ]:                           loginReducer,
    [ orderTask ]:                       orderTaskReducer,
    [ addPackage ]:                      addPackageReducer,
    [ editPackage ]:                     editPackageReducer,
    [ addRole ]:                         addRoleReducer,
    [ editRole ]:                        editRoleReducer,
    [ switchBusiness ]:                  switchBusinessReducer,
    [ employeeFormModule ]:              employeeFormReducer,
    [ scheduleFormModule ]:              scheduleFormReducer,
    [ settingSalary ]:                   settingSalaryReducer,
    [ employeeBreakScheduleFormModule ]: employeeBreakScheduleFormReducer,
    [ addBusinessPackage ]:              addBusinessPackageReducer,
    [ businessPackage ]:                 businessPackageReducer,
    [ managerRole ]:                     managerRoleReducer,
    [ profile ]:                         profileReducer,
    [ addClientVehicle ]:                addClientVehicleReducer,
    [ editClientVehicle ]:               editClientVehicleReducer,
    [ editClient ]:                      editClientReducer,
    [ addClientRequisite ]:              addClientRequisiteReducer,
    [ editClientRequisite ]:             editClientRequisiteReducer,
});
