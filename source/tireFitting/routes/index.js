// vendor
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';

// proj
import {
    ExceptionPage,
    DashboardPage,
    ProfilePage,
    LaborsPage,
    OrdersPage,
    OrderPage,
    CashSettingsPage,
    CashFlowPage,
    AddOrderPage,
    ClientsPage,
    ClientPage,
    EmployeesPage,
    AddEmployeePage,
    EditEmployeePage,
    ReportOrdersPage,
    ChartPage,
    ManagerRolePage,
} from 'tireFitting';

import book from 'routes/book';

export default class TireFittingRoutes extends Component {
    render() {
        return (
            <Switch>
                { /* Operations */ }
                <Route
                    exact
                    render={ props => <DashboardPage { ...props } /> }
                    path={ book.dashboard }
                />
                <Route
                    exact
                    render={ props => <OrdersPage { ...props } /> }
                    path={ book.ordersByStatuses }
                />
                <Route
                    exact
                    path={ book.orderId }
                    render={ props => (
                        <OrderPage key={ props.match.params.id } { ...props } />
                    ) }
                />
                <Route
                    exact
                    component={ AddOrderPage }
                    path={ book.addOrder }
                />
                { /* Reference book */ }
                <Route
                    exact
                    component={ ClientsPage }
                    path={ book.clients }
                />
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
                <Route
                    exact
                    component={ LaborsPage }
                    path={ book.laborsPage }
                />
                { /* Cash */ }
                <Route
                    exact
                    component={ CashSettingsPage }
                    path={ book.cashSettingsPage }
                />
                <Route
                    exact
                    component={ CashFlowPage }
                    path={ book.cashFlowPage }
                />
                { /* Statistics and reports */ }
                <Route
                    exact
                    component={ ChartPage }
                    path={ book.chart }
                />
                <Route
                    exact
                    component={ ReportOrdersPage }
                    path={ book.reportOrders }
                />
                { /* Roles */ }
                <Route
                    exact
                    component={ ManagerRolePage }
                    path={ book.managerRolePage }
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