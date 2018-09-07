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
    ClientsPage,
    EmployeePage,
    AddEmployeePage,
    EditEmployeePage,
    BusinessPackagePage,
    ManagerRolePage,
    ClientPage,
} from 'pages';
import book from './book';

export default class Private extends Component {
    render() {
        return (
            <Switch>
                { /* Operations */ }
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
                <Route exact component={ MyTasksPage } path={ book.myTasksPage } />
                { /* Reference book */ }
                <Route exact component={ ClientsPage } path={ book.clients } />
                <Route
                    exact
                    component={ EmployeePage }
                    path={ book.employeesPage }
                />
                <Route
                    exact
                    component={ AddEmployeePage }
                    path={ book.addEmployee }
                />
                <Route
                    exact
                    render={ props => <ClientPage { ...props } /> }
                    path={ book.clientId }
                />
                <Route
                    exact
                    component={ EditEmployeePage }
                    path={ book.editEmployee }
                />
                { /* Roles */ }
                <Route exact component={ PackagePage } path={ book.packagePage } />
                <Route exact component={ RolePage } path={ book.rolePage } />
                <Route
                    exact
                    component={ BusinessPackagePage }
                    path={ book.businessPackagePage }
                />
                <Route
                    exact
                    component={ ManagerRolePage }
                    path={ book.managerRolePage }
                />
                { /* Global */ }
                <Route exact component={ ProfilePage } path={ book.profile } />
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
