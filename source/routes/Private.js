// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import {
    DashboardPage,
    OrdersPage,
    OrderPage,
    AddOrderPage,
    ProfilePage,
    ExceptionPage,
    MyTasksPage,
    PackagePage,
    RolePage,
    BusinessPackagePage,
    ManagerRolePage,
} from 'pages';
import book from './book';

export default class Private extends Component {
    render() {
        return (
            <Switch>
                <Route exact component={ DashboardPage } path={ book.dashboard } />
                <Route
                    exact
                    component={ OrdersPage }
                    path={ book.ordersByStatuses }
                />
                <Route
                    exact
                    render={ props => <OrderPage { ...props } /> }
                    path={ book.orderId }
                />
                <Route exact component={ AddOrderPage } path={ book.addOrder } />
                <Route exact component={ ProfilePage } path={ book.profile } />
                <Route exact component={ MyTasksPage } path={ book.myTasksPage } />
                <Route exact component={ PackagePage } path={ book.packagePage } />
                <Route exact component={ RolePage } path={ book.rolePage } />
                <Route exact component={ BusinessPackagePage } path={ book.businessPackagePage } />
                <Route exact component={ ManagerRolePage } path={ book.managerRolePage} />

                <Route
                    component={ ExceptionPage }
                    path={ book.exceptionStatusCode }
                />
                <Redirect from='/' to={ book.ordersAppointments } />
                <Redirect to={ `${book.exception}/404` } />
            </Switch>
        );
    }
}
