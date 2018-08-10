// vendor
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { hot } from 'react-hot-loader';

// proj
import { authActions } from 'core/auth/actions';
import { uiActions } from 'core/ui/actions';
import { getToken } from 'utils';

import { Spinner, Catcher } from 'commons';
import { Exception } from 'containers';

// own
import book from './book';
import Private from './Private';
import Public from './Public';

@hot(module)
export default class Routes extends Component {
    render() {
        return (
            <Catcher>
                <Switch>
                    { !getToken() && <Public /> }
                    <Private />
                    <Route path={ book.exception } component={ Exception } />
                </Switch>
            </Catcher>
        );
    }
}
