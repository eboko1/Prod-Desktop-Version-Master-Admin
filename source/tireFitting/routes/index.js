// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import {
    ExceptionPage,
    NewDocumentPage,
    DashboardPage,
    ProfilePage,
    LaborsPage,
} from 'tireFitting';

import book from 'routes/book';

export default class TireFittingRoutes extends Component {
    render() {
        return (
            <Switch>
                { /* Operations */ }
                <Route
                    exact
                    render={ props => <NewDocumentPage { ...props } /> }
                    path={ book.newDocumentPage }
                />
                <Route
                    exact
                    render={ props => <DashboardPage { ...props } /> }
                    path={ book.dashboard }
                />
                { /* Reference book */ }
                <Route
                    exact
                    component={ LaborsPage }
                    path={ book.laborsPage }
                />
                { /* Global */ }
                <Route
                    exact
                    component={ ProfilePage }
                    path={ book.profile }
                />
                <Route
                    component={ ExceptionPage }
                    path={ book.exceptionStatusCode }
                />
                <Redirect exact from='/' to={ book.dashboard } />
                <Redirect to={ `${book.exception}/404` } />
            </Switch>
        );
    }
}