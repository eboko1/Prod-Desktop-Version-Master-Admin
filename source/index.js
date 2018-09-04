// vendor
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { LocaleProvider } from 'antd';

// proj
import { ConnectedIntlProvider as IntlProvider } from 'utils';
import('./theme/init.css'); // only chunk (split-point)
import './theme/antd/antd.less';
import './store/nprogress'; // whole file
import store, { history, persistor } from './store/store';
import Routes from './routes/Main';
import { setLocaleProvider } from 'utils';

render(
    <Provider store={ store }>
        <IntlProvider>
            <LocaleProvider locale={ setLocaleProvider() }>
                <PersistGate loading={ null } persistor={ persistor }>
                    <Router history={ history }>
                        <Routes />
                    </Router>
                </PersistGate>
            </LocaleProvider>
        </IntlProvider>
    </Provider>,
    document.getElementById('app'),
);
