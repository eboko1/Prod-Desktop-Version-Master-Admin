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
    ClientPage,
    EmployeesPage,
    AddEmployeePage,
    EditEmployeePage,
    ChartPage,
    ReviewsPage,
    ReviewPage,
    CallsPage,
    BusinessPackagePage,
    ManagerRolePage,
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
                    render={ props => <OrdersPage { ...props } /> }
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
                    render={ props => <ClientPage { ...props } /> }
                    path={ book.clientId }
                />
                <Route
                    exact
                    component={ EmployeesPage }
                    path={ book.employeesPage }
                />
                <Route
                    exact
                    component={ AddEmployeePage }
                    path={ book.addEmployee }
                />
                <Route
                    exact
                    component={ EditEmployeePage }
                    path={ book.editEmployee }
                />
                { /* Statistics */ }
                <Route exact component={ ChartPage } path={ book.chart } />
                <Route exact component={ ReviewsPage } path={ book.feedback } />
                <Route
                    exact
                    render={ props => <ReviewPage { ...props } /> }
                    path={ book.feedbackId }
                />
                <Route exact component={ CallsPage } path={ book.calls } />
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
                <Redirect exact from='/' to={ book.ordersAppointments } />
                <Redirect to={ `${book.exception}/404` } />
            </Switch>
        );
    }
}
