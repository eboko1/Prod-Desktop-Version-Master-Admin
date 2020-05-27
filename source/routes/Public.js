// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import { LoginPage, ForgotPasswordPage, NewPasswordPage } from 'pages';

import book from './book';

export default class Public extends Component {
    render() {
        return (
            <Switch>
                <Route exact component={ LoginPage } path={ book.login } />
                <Route
                    exact
                    component={ ForgotPasswordPage }
                    path={ book.forgotPassword }
                />
                <Route
                    exact
                    component={ NewPasswordPage }
                    path={ book.newPassword }
                />
                <Redirect to={ book.login } />
            </Switch>
        );
    }
}
