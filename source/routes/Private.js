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
    ServicesPage,
    BrandsPage,
    CashSettingsPage,
    CashBankPage,
    CashFlowPage,
    SuppliersPage,
    PaymentPage,
    SubscriptionHistoryPage,
    SubscriptionPackagesPage,
    UserAgreementPage,
    ExpensesPage,
    IncomesPage,
    ProductsGroupsPage,
    PriceGroupsPage,
    ProductsPage,
    ProductsTrackingPage,
    StorageBalancePage,
    StorageMovementPage,
    IncomeDocPage,
    ExpenseDocPage,
} from 'pages';
import book from './book';

export default class Private extends Component {
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
                <Route
                    exact
                    component={ SuppliersPage }
                    path={ book.suppliersPage }
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
                <Route
                    exact
                    component={ CashBankPage }
                    path={ book.cashBankPage }
                />
                { /* Storage */ }
                <Route
                    exact
                    component={ ProductsGroupsPage }
                    path={ book.productsGroups }
                />
                <Route
                    exact
                    component={ PriceGroupsPage }
                    path={ book.priceGroups }
                />
                <Route exact component={ ProductsPage } path={ book.products } />
                <Route
                    exact
                    component={ StorageBalancePage }
                    path={ book.storageBalance }
                />
                <Route
                    exact
                    component={ StorageMovementPage }
                    path={ book.storageMovement }
                />
                <Route
                    exact
                    component={ ProductsTrackingPage }
                    path={ book.productsTracking }
                />
                <Route
                    exact
                    component={ IncomesPage }
                    path={ book.storageIncomes }
                />
                <Route
                    exact
                    path={ book.storageIncomeDocId }
                    render={ props => (
                        <IncomeDocPage key={ props.match.params.id } { ...props } />
                    ) }
                />
                <Route
                    exact
                    path={ book.storageIncomeDoc }
                    render={ props => <IncomeDocPage { ...props } /> }
                />
                <Route
                    exact
                    component={ ExpensesPage }
                    path={ book.storageExpenses }
                />
                <Route
                    exact
                    path={ book.storageExpenseDocId }
                    render={ props => (
                        <ExpenseDocPage
                            key={ props.match.params.id }
                            { ...props }
                        />
                    ) }
                />
                <Route
                    exact
                    path={ book.storageExpenseDoc }
                    render={ props => <ExpenseDocPage { ...props } /> }
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
                { /* Payment */ }
                <Route exact component={ PaymentPage } path={ book.paymentPage } />
                <Route
                    exact
                    component={ SubscriptionHistoryPage }
                    path={ book.subscriptionHistoryPage }
                />
                <Route
                    exact
                    component={ SubscriptionPackagesPage }
                    path={ book.subscriptionPackagesPage }
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
                { /* Administration */ }
                <Route
                    exact
                    component={ ServicesPage }
                    path={ book.servicesPage }
                />
                <Route exact component={ BrandsPage } path={ book.brandsPage } />
                { /* Global */ }
                <Route exact component={ ProfilePage } path={ book.profile } />
                <Route
                    exact
                    component={ UserAgreementPage }
                    path={ book.userAgreement }
                />
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
