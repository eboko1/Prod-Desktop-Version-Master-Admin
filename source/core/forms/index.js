// vendor
import { combineReducers } from 'redux';

// own
import orderReducer, { moduleName as order } from './orderForm/duck';
import loginReducer, { moduleName as login } from './loginForm/duck';

import addPackageReducer, {
    moduleName as addPackage,
} from './addPackageForm/duck';
import editPackageReducer, {
    moduleName as editPackage,
} from './editPackageForm/duck';

import addRoleReducer, { moduleName as addRole } from './addRoleForm/duck';
import editRoleReducer, { moduleName as editRole } from './editRoleForm/duck';

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
import employeeFormReducer, { moduleName as employeeFormModule } from 'core/forms/employeeForm/duck';

// combine all forms reducers to forms reducer in store
export const formsReducer = combineReducers({
    [ order ]:              orderReducer,
    [ addClient ]:          addClientReducer,
    [ universalFilters ]:   universalFiltersReducer,
    [ cancelReason ]:       cancelReasonReducer,
    [ toSuccess ]:          toSuccessReducer,
    [ login ]:              loginReducer,
    [ orderTask ]:          orderTaskReducer,
    [ addPackage ]:         addPackageReducer,
    [ editPackage ]:        editPackageReducer,
    [ addRole ]:            addRoleReducer,
    [ editRole ]:           editRoleReducer,
    [ switchBusiness ]:     switchBusinessReducer,
    [ employeeFormModule ]: employeeFormReducer,
});
