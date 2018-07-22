// vendor
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
            <DragDropContextProvider backend={ HTML5Backend }>
                <Router history={ history }>
                    <Routes />
                </Router>
            </DragDropContextProvider>
        </IntlProvider>
    </Provider>,
    document.getElementById('app'),
);
