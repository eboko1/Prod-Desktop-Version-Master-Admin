// vendor
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { LocaleProvider } from 'antd';

// proj
import { ConnectedIntlProvider as IntlProvider } from 'utils';
import { setLocaleProvider } from 'utils';
import store, { persistor } from './store/store';
import history from './store/history';
import Routes from './routes/Main';

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={ null } persistor={ persistor }>
                    <IntlProvider>
                        <LocaleProvider locale={ setLocaleProvider() }>
                            <ConnectedRouter history={ history }>
                                <Routes />
                            </ConnectedRouter>
                        </LocaleProvider>
                    </IntlProvider>
                </PersistGate>
            </Provider>
        );
    }
}
