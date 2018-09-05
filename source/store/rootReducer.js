// vendor
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native

// proj
import intl from 'core/intl/reducer';
import uiReducer, { moduleName as uiModule } from 'core/ui/duck';
import authReducer, { moduleName as authModule } from 'core/auth/duck';
import { formsReducer as forms } from 'core/forms';
import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import myTasksReducer, { moduleName as myTasksModule } from 'core/myTasks/duck';
import employeeReducer, {
    moduleName as employeeModule,
} from 'core/employee/duck';
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

import dashboardReducer, {
    moduleName as dashboardModule,
} from 'core/dashboard/duck';
import searchReducer, { moduleName as searchModule } from 'core/search/duck';

export const persistConfig = {
    key:       'user',
    storage,
    whitelist: [ 'auth' ],
};

const reducer = combineReducers({
    forms,
    [ ordersModule ]:          ordersReducer,
    [ orderModule ]:           orderReducer,
    [ modalsModule ]:          modalsReducer,
    [ dashboardModule ]:       dashboardReducer,
    [ myTasksModule ]:         myTasksReducer,
    [ employeeModule ]:        employeeReducer,
    [ uiModule ]:              uiReducer,
    [ authModule ]:            authReducer,
    [ packageModule ]:         packageReducer,
    [ roleModule ]:            roleReducer,
    [ businessPackageModule ]: businessPackageReducer,
    [ searchModule ]:          searchReducer,
    [ managerRoleModule ]:     managerRoleReducer,
    intl,
    router,
});

const rootReducer = persistReducer(persistConfig, reducer);

export default rootReducer;
