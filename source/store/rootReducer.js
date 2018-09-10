// vendor
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import { LOCATION_CHANGE } from 'react-router-redux';

// proj
import intl from 'core/intl/reducer';
import uiReducer, { moduleName as uiModule } from 'core/ui/duck';
import authReducer, { moduleName as authModule } from 'core/auth/duck';
import { formsReducer as forms } from 'core/forms';
import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import clientsReducer, { moduleName as clientsModule } from 'core/clients/duck';
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
import clientReducer, { moduleName as clientModule } from 'core/client/duck';
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

const persistedReducer = combineReducers({
    [ authModule ]: authReducer,
});

const appReducer = combineReducers({
    forms,
    [ ordersModule ]:          ordersReducer,
    [ orderModule ]:           orderReducer,
    [ modalsModule ]:          modalsReducer,
    [ dashboardModule ]:       dashboardReducer,
    [ myTasksModule ]:         myTasksReducer,
    [ employeeModule ]:        employeeReducer,
    [ uiModule ]:              uiReducer,
    [ packageModule ]:         packageReducer,
    [ roleModule ]:            roleReducer,
    [ businessPackageModule ]: businessPackageReducer,
    [ searchModule ]:          searchReducer,
    [ managerRoleModule ]:     managerRoleReducer,
    [ clientsModule ]:         clientsReducer,
    [ clientModule ]:          clientReducer,
    [ clientRequisiteModule ]: clientRequisiteReducer,
    intl,
    router,
});

const reducer = (state, action) => {
    let initialState = state;
    if (action.type === LOCATION_CHANGE) {
        console.log('→LOCATION_CHANGE 111', state);

        initialState = void 0;
    }
    // console.log('→LOCATION_CHANGE 222', state);
    console.log('aaa', {
        ...appReducer(initialState, action),
        ...persistedReducer(state, action),
    });
    console.log('→ state', state);
    console.log('→ initialState', initialState);

    return {
        ...appReducer(initialState, action),
        ...persistedReducer(state, action),
    };
};

// const reducer = (state, action) =>
//     appReducer(
//         action.type === LOCATION_CHANGE
//             ? {
//                 ...appReducer({}, {}),
//                 router: state && state.router || {},
//             }
//             : state,
//         action,
//     );
console.log('→ reducer', reducer);

const rootReducer = persistReducer(persistConfig, reducer);

export default rootReducer;
