// Core
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';

// Instruments
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

// import { loadStore } from './store';
// import _ from 'lodash';
//
// export const loadStore = () => {
//     try {
//         const serializedStore = localStorage.getItem('state');
//         if (serializedStore === null) {
//             return undefined;
//         }
//
//         return JSON.parse(serializedStore);
//     } catch (error) {
//         return undefined;
//     }
// };
//
// export const saveStore = state => {
//     try {
//         const serializedStore = JSON.stringify(state);
//         localStorage.setItem('state', serializedStore);
//     } catch (error) {
//         throw new Error(`saveStore:\n${error}`);
//     }
// };
//
// const persistedStore = loadStore();
//
// // store.subscribe(() => saveStore(store.getState()));
// store.subscribe(
//     _.throttle(() => {
//         saveStore({
//             user: store.getState().user,
//         });
//     }, 1000),
// );
