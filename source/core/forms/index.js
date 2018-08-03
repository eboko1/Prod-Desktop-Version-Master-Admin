// vendor
import { combineReducers } from 'redux';

// own
import addOrderReducer, { moduleName as addOrder } from './addOrderForm/duck';
import orderReducer, { moduleName as order } from './orderForm/duck';
import loginReducer, { moduleName as login } from './loginForm/duck';

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

// combine all forms reducers to forms reducer in store
export const formsReducer = combineReducers({
    [ addOrder ]:         addOrderReducer,
    [ order ]:            orderReducer,
    [ addClient ]:        addClientReducer,
    [ universalFilters ]: universalFiltersReducer,
    [ cancelReason ]:     cancelReasonReducer,
    [ toSuccess ]:        toSuccessReducer,
    [ login ]:            loginReducer,
    [ orderTask ]:        orderTaskReducer,
});
