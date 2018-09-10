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
    // [ authModule ]:            authReducer,
    // intl,
    // router,
};

const persistedReducer = combineReducers(persistedState);

const appReducer = combineReducers(appState);

const globalReducer = combineReducers({ ...persistedState, ...appState });
console.log('→ 111111');
// const reducer = (state, action) => {
//     let initialState = state;
//     if (action.type === LOCATION_CHANGE) {
//         console.log('→LOCATION_CHANGE 111', state);
//         let persistedState = _.pick(initialState, 'auth');
//         initialState = void 0;
//     }
//     // console.log('→LOCATION_CHANGE 222', state);
//     console.log('→ state', state);
//
//     return appReducer(state, action);
// };
const reducer = (state, action) => {
    console.log('→ reducer action', action);
    let initialState = state;
    const auth = _.pick(initialState, 'auth');
    if (action.type === LOCATION_CHANGE) {
        console.log('→1111111LOCATION_CHANGE __ыефеу', state);

        initialState = {
            ...auth,
        };
        console.log('→1111111LOCATION_CHANGE _init', initialState);
    }
    console.log('→LOCATION_CHANGE __ыефеу', state);
    console.log('→LOCATION_CHANGE _init', initialState);

    return globalReducer(initialState, action);
};
// console.log('→ 222222', reducer());

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

const rootReducer = persistReducer(persistConfig, (state, action) => {
    console.log('→ persistReducer state', state);
    console.log('→ persistReducer action', action);

    return reducer(state, action);
});
console.log('→ 33333');
export default rootReducer;

// const reducer = (state, action) => {
//     let initialState = state;
//     if (action.type === LOCATION_CHANGE) {
//         console.log('→LOCATION_CHANGE 111', state);
//
//         initialState = void 0;
//     }
//     // console.log('→LOCATION_CHANGE 222', state);
//     console.log('aaa', {
//         ...persistedReducer(state, action),
//         ...appReducer(initialState, action),
//     });
//     console.log('→ state', state);
//     console.log('→ initialState', initialState);
//
//     return {
//         ...persistedReducer(state, action),
//         ...appReducer(initialState, action),
//     };
// };
