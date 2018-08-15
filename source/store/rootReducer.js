// vendor
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

// proj
// import { rootPersistReducer } from './persistor';
import intl from 'core/intl/reducer';
import uiReducer, { moduleName as uiModule } from 'core/ui/duck';
import authReducer, { moduleName as authModule } from 'core/auth/duck';
import { formsReducer as forms } from 'core/forms';
import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import myTasksReducer, { moduleName as myTasksModule } from 'core/myTasks/duck';
import orderReducer, { moduleName as orderModule } from 'core/order/duck';
import modalsReducer, { moduleName as modalsModule } from 'core/modals/duck';
import userReducer, { moduleName as userModule } from 'core/user/duck';

import dashboardReducer, {
    moduleName as dashboardModule,
} from 'core/dashboard/duck';

const rootReducer = combineReducers({
    forms,
    [ ordersModule ]:    ordersReducer,
    [ orderModule ]:     orderReducer,
    [ modalsModule ]:    modalsReducer,
    [ dashboardModule ]: dashboardReducer,
    [ myTasksModule ]:   myTasksReducer,
    [ userModule ]:      userReducer,
    [ uiModule ]:        uiReducer,
    [ authModule ]:      authReducer,
    intl,
    router,
    // [ universalFilters ]: universalFiltersReducer,
});

export default rootReducer;
