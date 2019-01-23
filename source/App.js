// vendor
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter as Router } from 'react-router-redux';
import { LocaleProvider } from 'antd';

// proj
import { ConnectedIntlProvider as IntlProvider } from 'utils';
import { setLocaleProvider } from 'utils';
import store, { history, persistor } from './store/store';
import Routes from './routes/Main';

export default class App extends Component {
    render() {
        return (
            <Provider store={ store }>
                <PersistGate loading={ null } persistor={ persistor }>
                    <IntlProvider>
                        <LocaleProvider locale={ setLocaleProvider() }>
                            <Router history={ history }>
                                <Routes />
                            </Router>
                        </LocaleProvider>
                    </IntlProvider>
                </PersistGate>
            </Provider>
        );
    }
}
