// vendor
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';

// proj
import { ConnectedIntlProvider as IntlProvider } from 'utils';
import('./theme/init.css'); // only chunk (split-point)
import './theme/antd/antd.less';
import './store/nprogress'; // whole file
import store, { history } from './store/store';
import Routes from './routes/Main';

render(
    <Provider store={ store }>
        <IntlProvider>
            <Router history={ history }>
                <Routes />
            </Router>
        </IntlProvider>
    </Provider>,
    document.getElementById('app'),
);
