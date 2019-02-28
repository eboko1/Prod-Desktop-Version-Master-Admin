// vendor
import { routerMiddleware as createRouterMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import nprogress from 'nprogress';

// proj
import history from './history';

const routerMiddleware = createRouterMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const middleware = [ thunk, sagaMiddleware, routerMiddleware ];

if (__LOCAL__ || __DEV__) {
    /**
     * redux-logger заимпортирован черезе require внутри блока if,
     * для того, чтобы он не попал в бандл
     */
    const { createLogger } = require("redux-logger"); // eslint-disable-line

    const logger = createLogger({
        duration:  true,
        timestamp: true,
        collapsed: true,
        diff:      true,
        colors:    {
            title:     () => 'deepskyblue',
            prevState: () => 'dodgerblue',
            action:    () => 'greenyellow',
            nextState: () => 'OliveDrab',
            error:     () => 'firebrick',
        },
    });

    middleware.push(logger);
}

history.listen(() => {
    nprogress.start();
    nprogress.done();
});

export { sagaMiddleware, middleware };
