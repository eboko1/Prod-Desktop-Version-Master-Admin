// vendor
import { combineReducers } from 'redux';

// own
import storeGroupsReducer, { moduleName as storeGroups } from './storeGroups';
import priceGroupsReducer, { moduleName as priceGroups } from './priceGroups';
import productsReducer, { moduleName as products } from './products';
import storeBalanceReducer, {
    moduleName as storeBalance,
} from './storeBalance';
import storeMovementReducer, {
    moduleName as storeMovement,
} from './storeMovement';
import trackingReducer, { moduleName as tracking } from './tracking';
import incomesReducer, { moduleName as incomes } from './incomes';
import expensesReducer, { moduleName as expenses } from './expenses';

// combine all storage reducers to storage reducer fro global redux store
export const storageReducer = combineReducers({
    [ storeGroups ]:   storeGroupsReducer,
    [ priceGroups ]:   priceGroupsReducer,
    [ products ]:      productsReducer,
    [ storeBalance ]:  storeBalanceReducer,
    [ storeMovement ]: storeMovementReducer,
    [ tracking ]:      trackingReducer,
    [ incomes ]:       incomesReducer,
    [ expenses ]:      expensesReducer,
});
