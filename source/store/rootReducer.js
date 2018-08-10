// vendor
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

// proj
import intl from 'core/intl/reducer';
import ui from 'core/ui/reducer';
import auth from 'core/auth/reducer';
import { formsReducer as forms } from 'core/forms';
import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import myTasksReducer, { moduleName as myTasksModule } from 'core/myTasks/duck';
import orderReducer, { moduleName as orderModule } from 'core/order/duck';
import modalsReducer, { moduleName as modalsModule } from 'core/modals/duck';

import dashboardReducer, {
    moduleName as dashboardModule,
} from 'core/dashboard/duck';

const rootReducer = combineReducers({
    intl,
    auth,
    forms,
    router,
    ui,
    [ ordersModule ]:    ordersReducer,
    [ orderModule ]:     orderReducer,
    [ modalsModule ]:    modalsReducer,
    [ dashboardModule ]: dashboardReducer,
    [ myTasksModule ]:   myTasksReducer,
    // [ universalFilters ]: universalFiltersReducer,
});

export default rootReducer;
