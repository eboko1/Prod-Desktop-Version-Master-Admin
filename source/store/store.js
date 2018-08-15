// Core
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import userReducer, { moduleName as userModule } from 'core/user/duck';

// Own
import { middleware, sagaMiddleware } from './middleware';
import { composeEnhancers } from './enhancers';
import rootReducer from './rootReducer';
// import { rootPersistReducer } from './persistor';
import rootSaga from './rootSaga';
import { intl } from './intl';

const initialState = {
    intl,
};

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: [ 'user' ],
};

// const persistedReducer = { [ userModule ]: userReducer, ...rootReducer };

export const rootPersistReducer = persistReducer(
    persistConfig,
    // persistedReducer,
    rootReducer,
);

const store = createStore(
    // () => null,
    // rootReducer,
    rootPersistReducer,
    initialState,
    composeEnhancers()(applyMiddleware(...middleware)),
);

export const persistor = persistStore(store);

// if (module.hot) {
//     module.hot.accept(() => {
//         // This fetch the new state of the above reducers.
//         const nextPersistedReducer = persistedReducer;
//         store.replaceReducer(
//             persistReducer(persistConfig, nextPersistedReducer),
//         );
//     });
// }

export { history } from './middleware';
export default store;

sagaMiddleware.run(rootSaga);
