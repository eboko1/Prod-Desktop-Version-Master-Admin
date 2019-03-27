// vendor
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { LOCATION_CHANGE } from 'connected-react-router';
import _ from 'lodash';

// proj
import intl from 'core/intl/reducer';
import uiReducer, { moduleName as uiModule } from 'core/ui/duck';
import subscriptionReducer, {
    moduleName as subscriptionModule,
} from 'core/subscription/duck';
import errorMessageReducer, {
    moduleName as errorMessageModule,
} from 'core/errorMessage/duck';
import authReducer, { moduleName as authModule } from 'core/auth/duck';

import { formsReducer as forms } from 'core/forms';
import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import clientsReducer, { moduleName as clientsModule } from 'core/clients/duck';
import myTasksReducer, { moduleName as myTasksModule } from 'core/myTasks/duck';
import employeesReducer, {
    moduleName as employeesModule,
} from 'core/employees/duck';
import orderReducer, { moduleName as orderModule } from 'core/order/duck';
import modalsReducer, { moduleName as modalsModule } from 'core/modals/duck';
import packageReducer, { moduleName as packageModule } from 'core/package/duck';
import businessPackageReducer, {
    moduleName as businessPackageModule,
} from 'core/businessPackage/duck';
import managerRoleReducer, {
    moduleName as managerRoleModule,
} from 'core/managerRole/duck';

import employeeScheduleReducer, {
    moduleName as employeeScheduleModule,
} from 'core/employeeSchedule/duck';
import roleReducer, { moduleName as roleModule } from 'core/role/duck';
import clientReducer, { moduleName as clientModule } from 'core/client/duck';
import clientOrdersReducer, {
    moduleName as clientOrdersModule,
} from 'core/clientOrders/duck';
import clientRequisiteReducer, {
    moduleName as clientRequisiteModule,
} from 'core/clientRequisite/duck';
import chartReducer, { moduleName as chartModule } from 'core/chart/duck';
import reviewsReducer, { moduleName as reviewsModule } from 'core/reviews/duck';
import reviewReducer, { moduleName as reviewModule } from 'core/review/duck';
import callsReducer, { moduleName as callsModule } from 'core/calls/duck';
import tecDocActionsReducer, {
    moduleName as tecDocActionsModule,
} from 'core/tecDocActions/duck';

import dashboardReducer, {
    moduleName as dashboardModule,
} from 'core/dashboard/duck';
import searchReducer, { moduleName as searchModule } from 'core/search/duck';

import servicesSuggestionsReducer, {
    moduleName as servicesSuggestionsModule,
} from 'core/servicesSuggestions/duck';
import vehicleNumberHistoryReducer, {
    moduleName as vehicleNumberHistoryModule,
} from 'core/vehicleNumberHistory/duck';
import cashReducer, { moduleName as cashModule } from 'core/cash/duck';
import suppliersReducer, {
    moduleName as suppliersModule,
} from 'core/suppliers/duck';
import paymentsReducer, {
    moduleName as paymentsModule,
} from 'core/payments/duck';

// own
import history from './history';

export const persistConfig = {
    key:       'persistedStore',
    storage,
    whitelist: [ 'auth', 'subscription' ],
};

const persistedState = {
    [ authModule ]:         authReducer,
    [ subscriptionModule ]: subscriptionReducer,
    intl,
    router:                 connectRouter(history),
};

const appState = {
    forms,
    [ businessPackageModule ]:      businessPackageReducer,
    [ callsModule ]:                callsReducer,
    [ cashModule ]:                 cashReducer,
    [ chartModule ]:                chartReducer,
    [ clientModule ]:               clientReducer,
    [ clientOrdersModule ]:         clientOrdersReducer,
    [ clientRequisiteModule ]:      clientRequisiteReducer,
    [ clientsModule ]:              clientsReducer,
    [ dashboardModule ]:            dashboardReducer,
    [ employeeScheduleModule ]:     employeeScheduleReducer,
    [ employeesModule ]:            employeesReducer,
    [ errorMessageModule ]:         errorMessageReducer,
    [ managerRoleModule ]:          managerRoleReducer,
    [ modalsModule ]:               modalsReducer,
    [ myTasksModule ]:              myTasksReducer,
    [ orderModule ]:                orderReducer,
    [ ordersModule ]:               ordersReducer,
    [ packageModule ]:              packageReducer,
    [ paymentsModule ]:             paymentsReducer,
    [ reviewModule ]:               reviewReducer,
    [ reviewsModule ]:              reviewsReducer,
    [ roleModule ]:                 roleReducer,
    [ searchModule ]:               searchReducer,
    [ servicesSuggestionsModule ]:  servicesSuggestionsReducer,
    [ suppliersModule ]:            suppliersReducer,
    [ tecDocActionsModule ]:        tecDocActionsReducer,
    [ uiModule ]:                   uiReducer,
    [ vehicleNumberHistoryModule ]: vehicleNumberHistoryReducer,
};

const appReducer = combineReducers({ ...persistedState, ...appState });

const reducer = (state, action) => {
    const { type, payload } = action;
    let resetedState = null;

    if (
        type === LOCATION_CHANGE &&
        _.get(payload, 'pathname') !== _.get(state, 'router.location.pathname')
    ) {
        resetedState = Object.keys(persistedState).reduce(
            (resetedState, moduleName) => {
                resetedState[ moduleName ] = state[ moduleName ];

                return resetedState;
            },
            {},
        );
    }

    return appReducer(resetedState || state, action);
};

const rootReducer = persistReducer(persistConfig, (state, action) => {
    return reducer(state, action);
});

export default rootReducer;
