import { combineReducers } from 'redux';

// import universalFiltersForm from './universalFiltersForm/duck';
import addOrderReducer, { moduleName as addOrder } from './addOrderForm/duck';
import orderReducer, { moduleName as order } from './orderForm/duck';
import universalFiltersReducer, {
    moduleName as universalFilters,
} from './universalFiltersForm/duck';

export const formsReducer = combineReducers({
    [ addOrder ]:         addOrderReducer,
    [ order ]:            orderReducer,
    [ universalFilters ]: universalFiltersReducer,
});

// export default formsReducer;
// formikForm -> initial structure for ProfileForm
// import { combineReducers } from 'redux';
//
// import formikForm from './formikForm/reducer';
//
// const forms = combineReducers({
//     formikForm,
// });
//
// export default forms;
