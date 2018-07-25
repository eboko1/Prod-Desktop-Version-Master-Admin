// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
// import { Login } from 'containers';
import { LoginPage } from 'pages';

import book from './book';

export default class Public extends Component {
    render() {
        return (
            <Switch>
                { /* <Route exact component={ Login } path={ book.login } /> */ }
                <Route exact component={ LoginPage } path={ book.login } />
                { /* <Route exact component={ Home } path={ book.home } /> */ }
                <Redirect to={ book.login } />
            </Switch>
        );
    }
}
