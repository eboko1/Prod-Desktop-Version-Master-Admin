// Core
import { createStore, applyMiddleware } from 'redux';

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

export { history } from './middleware';
export default store;

sagaMiddleware.run(rootSaga);
