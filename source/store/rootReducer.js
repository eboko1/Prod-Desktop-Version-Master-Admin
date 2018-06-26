import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import intl from 'core/intl/reducer';
import swapi from 'core/swapi/reducer';
import ui from 'core/ui/reducer';
import auth from 'core/auth/reducer';
// import forms from 'core/forms/reducer'; // тут был формик (сейчас рабочие redux-actions )
// import forms from 'core/forms/antdReduxForm/reducer';
import forms from 'core/forms/addOrder/reducer';

import ordersReducer, { moduleName as ordersModule } from 'core/orders/duck';
import orderReducer, { moduleName as orderModule } from 'core/order/duck';
import addOrderReducer, {
    moduleName as addOrderModule,
} from 'core/addOrder/duck';
import universalFiltersReducer, {
    moduleName as universalFilters,
} from 'core/forms/universalFiltersForm/duck';

const rootReducer = combineReducers({
    intl,
    auth,
    forms,
    router,
    swapi,
    ui,
    [ ordersModule ]:     ordersReducer,
    [ orderModule ]:      orderReducer,
    [ addOrderModule ]:   addOrderReducer,
    [ universalFilters ]: universalFiltersReducer,
});

export default rootReducer;
