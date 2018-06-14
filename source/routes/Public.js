import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import book from './book';

import { Home, Login } from 'containers';

export default class Public extends Component {
    render() {
        return (
            <Switch>
                <Route exact component={ Login } path={ book.login } />
                <Route exact component={ Home } path={ book.home } />
                <Redirect to={ book.home } />
            </Switch>
        );
    }
}
