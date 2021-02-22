// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import {
    DashboardPage,
} from "pages";

import {
    NewDocumentPage,
} from 'tireFitting';

import tireFittingBook from './book';

export default class TireFittingRoutes extends Component {
    render() {
        return (
            <Switch>
                { /* Operations */ }
                <Route
                    exact
                    render={ props => <NewDocumentPage { ...props } /> }
                    path={ tireFittingBook.newDocumentPage }
                />
                <Route
                    exact
                    render={ props => <DashboardPage { ...props } /> }
                    path={ tireFittingBook.dashboard }
                />
                <Redirect exact from='/' to={ tireFittingBook.dashboard } />
                <Redirect to={ `${tireFittingBook.exception}/404` } />
            </Switch>
        );
    }
}