import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import userReducer, { moduleName as userModule } from 'core/user/duck';

const persistConfig = {
    key:       'persist',
    storage,
    whitelist: [ 'user' ],
};

const persistedReducer = { [ userModule ]: userReducer };

export const rootPersistReducer = persistReducer(
    persistConfig,
    persistedReducer,
);

// persistStore(store, config, callback)

export default () => {
    // create store and persistor per normal...

    if (module.hot) {
        module.hot.accept(() => {
            // This fetch the new state of the above reducers.
            const nextPersistedReducer = persistedReducer;
            store.replaceReducer(
                persistReducer(persistConfig, nextPersistedReducer),
            );
        });
    }

    // let store = createStore(persistedReducer);
    let persistor = persistStore(store);

    return { store, persistor };
};
