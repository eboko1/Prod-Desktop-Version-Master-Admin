// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import { LoginPage } from 'pages';

import book from './book';

export default class Public extends Component {
    render() {
        return (
            <Switch>
                <Route exact component={ LoginPage } path={ book.login } />
                <Redirect to={ book.login } />
            </Switch>
        );
    }
}
