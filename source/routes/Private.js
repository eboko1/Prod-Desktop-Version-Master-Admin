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
    EmployeePage,
    AddEmployeePage,
    EditEmployeePage,
} from 'pages';
import book from './book';

export default class Private extends Component {
    render() {

        return (
            <Switch>
                <Route exact component={ DashboardPage } path={ book.dashboard } />
                <Route exact component={ EmployeePage } path={ book.employeesPage } />
                <Route exact component={ AddEmployeePage } path={ book.addEmployee } />
                <Route exact component={ EditEmployeePage } path={ book.editEmployee } />

                
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
