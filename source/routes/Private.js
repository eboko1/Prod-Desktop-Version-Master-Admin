// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import { DistributorDash, Request, SwapiBox } from 'containers';
import {
    OrdersPage,
    OrderPage,
    AddOrderPage,
    ProfilePage,
    ExceptionPage,
} from 'pages';

import book from './book';

export default class Private extends Component {
    render() {
        return (
            <Switch>
                <Route exact component={ ProfilePage } path={ book.profile } />
                <Route exact component={ SwapiBox } path={ book.swapi } />
                <Route
                    exact
                    component={ DistributorDash }
                    path={ book.distributorDash }
                />
                <Route exact component={ Request } path={ book.request } />
                { /* <Switch>

                    <Redirect
                        from={ book.orders }
                        to={ `${book.orders}/appointments` }
                    />
                </Switch> */ }
                <Route
                    exact
                    component={ OrdersPage }
                    path={ book.ordersByStatuses }
                />
                <Route exact component={ OrderPage } path={ book.orderId } />
                <Route exact component={ AddOrderPage } path={ book.addOrder } />
                <Route
                    component={ ExceptionPage }
                    path={ book.exceptionStatusCode }
                />
                <Redirect to={ `${book.exception}/404` } />
            </Switch>
        );
    }
}
