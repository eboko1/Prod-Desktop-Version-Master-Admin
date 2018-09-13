// vendor
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { LOCATION_CHANGE } from 'react-router-redux';
import _ from 'lodash';

// proj
import intl from 'core/intl/reducer';
import uiReducer, { moduleName as uiModule } from 'core/ui/duck';
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

import roleReducer, { moduleName as roleModule } from 'core/role/duck';
import clientReducer, { moduleName as clientModule } from 'core/client/duck';
import clientOrdersReducer, {
    moduleName as clientOrdersModule,
} from 'core/clientOrders/duck';
import clientRequisiteReducer, {
    moduleName as clientRequisiteModule,
} from 'core/clientRequisite/duck';

import dashboardReducer, {
    moduleName as dashboardModule,
} from 'core/dashboard/duck';
import searchReducer, { moduleName as searchModule } from 'core/search/duck';

export const persistConfig = {
    key:       'user',
    storage,
    whitelist: [ 'auth' ],
};

const persistedState = {
    [ authModule ]: authReducer,
    intl,
    router,
};

const appState = {
    forms,
    [ ordersModule ]:          ordersReducer,
    [ orderModule ]:           orderReducer,
    [ modalsModule ]:          modalsReducer,
    [ dashboardModule ]:       dashboardReducer,
    [ myTasksModule ]:         myTasksReducer,
    [ employeesModule ]:       employeesReducer,
    [ uiModule ]:              uiReducer,
    [ packageModule ]:         packageReducer,
    [ roleModule ]:            roleReducer,
    [ businessPackageModule ]: businessPackageReducer,
    [ searchModule ]:          searchReducer,
    [ managerRoleModule ]:     managerRoleReducer,
    [ clientsModule ]:         clientsReducer,
    [ clientModule ]:          clientReducer,
    [ clientRequisiteModule ]: clientRequisiteReducer,
    [ clientOrdersModule ]:    clientOrdersReducer,
    // [ authModule ]:            authReducer,
    // intl,
    // router,
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
