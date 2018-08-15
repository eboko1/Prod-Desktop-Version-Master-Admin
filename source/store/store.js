// Core
import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';

// Own
import { middleware, sagaMiddleware } from './middleware';
import { composeEnhancers } from './enhancers';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';
import { intl } from './intl';

const initialState = {
    intl,
};

const store = createStore(
    // () => null,
    rootReducer,
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
