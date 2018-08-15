// vendor
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';

// proj
import { ConnectedIntlProvider as IntlProvider } from 'utils';
import('./theme/init.css'); // only chunk (split-point)
import './theme/antd/antd.less';
import './store/nprogress'; // whole file
import store, { history, persistor } from './store/store';
import Routes from './routes/Main';

render(
    <Provider store={ store }>
        <IntlProvider>
            <PersistGate loading={ null } persistor={ persistor }>
                <Router history={ history }>
                    <Routes />
                </Router>
            </PersistGate>
        </IntlProvider>
    </Provider>,
    document.getElementById('app'),
);
