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
    AnalyticsPage,
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
    LaborsPage,
    BrandsPage,
    CashSettingsPage,
    CashBankPage,
    CashFlowPage,
    CashClientsDebtsPage,
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
    StorageDocumentPage,
    DiagnosticPatternsPage,
    AvailabilitiesPage,
    StorageOrdersPage,
    StorageTransferPage,
    AgreementPage,
    WarehousesPage,
    RequisiteSettingPage,
    NewDocumentPage,
    SupplierPage,
    RepairMapSettingPage,
    ReportOrdersPage,
    ReportLoadKPIPage,
    LocationsPage,
    LocationSettingsPage,
    LocationsDocumentPage,
    LocationsVehiclesPage,
    LocationsMovementPage,
    SyncImportPage,
    SyncExportPage,
    BarcodePage,

} from 'pages';
import book from './book';

export default class Private extends Component {
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
                <Route
                    exact
                    component={ MyTasksPage }
                    path={ book.myTasksPage }
                />
                <Route
                    exact
                    component={ BarcodePage }
                    path={ book.barcodePage }
                />
                { /* Reference book */ }
                <Route
                    exact
                    component={ ClientsPage }
                    path={ book.clients }
                />
                <Route
                    exact
                    component={AnalyticsPage}
                    path={book.analytics}
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
                    component={ SuppliersPage }
                    path={ book.suppliersPage }
                />
                <Route
                    exact
                    component={ LaborsPage }
                    path={ book.laborsPage }
                />
                <Route
                    exact
                    component={ WarehousesPage }
                    path={ book.warehouses }
                />
                <Route 
                    exact
                    component={ DiagnosticPatternsPage }
                    path={ book.diagnosticPatterns }
                />
                <Route 
                    exact
                    path={ book.supplierPage }
                     render={ props => (
                        <SupplierPage id={ props.match.params.id } { ...props } />
                    ) }
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
                    component={ CashClientsDebtsPage }
                    path={ book.cashClientsDebtsPage }
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
                <Route 
                    exact
                    component={ ProductsPage }
                    path={ book.products }
                />

                <Route
                    exact
                    component={ StorageOrdersPage }
                    path={ book.storageOrders }
                />
                <Route
                    exact
                    component={ IncomesPage }
                    path={ book.storageIncomes }
                />
                <Route
                    exact
                    component={ ExpensesPage }
                    path={ book.storageExpenses }
                />
                <Route
                    exact
                    component={ StorageTransferPage }
                    path={ book.storageTransfers }
                />
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
                    path={ book.storageDocument }
                    render={ props => <StorageDocumentPage { ...props } /> }
                />
                <Route
                    exact
                    path={ book.storageDocumentId }
                    render={ props => (
                        <StorageDocumentPage id={ props.match.params.id } { ...props } />
                    ) }
                />
                <Route
                    exact
                    path={ book.productsTracking }
                    render={ props => (
                        <ProductsTrackingPage type={ props.location.type } { ...props } />
                    ) }
                />
                <Route
                    exact
                    path={ book.repairMapSetting }
                    render={ props => <RepairMapSettingPage { ...props } /> }
                />
                { /* Locations */ }
                <Route
                    exact
                    component={ LocationsPage }
                    path={ book.locationsPage }
                />
                <Route
                    exact
                    component={ LocationSettingsPage }
                    path={ book.locationSettings }
                />
                <Route
                    exact
                    component={ LocationsDocumentPage }
                    path={ book.locationsDocument }
                />
                <Route
                    exact
                    component={ LocationsVehiclesPage }
                    path={ book.locationsVehicles }
                />
                <Route
                    exact
                    component={ LocationsMovementPage }
                    path={ book.locationsMovement }
                />
                { /* Statistics and reports */ }
                <Route
                    exact
                    component={ ChartPage }
                    path={ book.chart }
                />
                <Route
                    exact
                    component={ ReviewsPage }
                    path={ book.feedback }
                />
                <Route
                    exact
                    render={ props => <ReviewPage { ...props } /> }
                    path={ book.feedbackId }
                />
                <Route
                    exact
                    component={ CallsPage }
                    path={ book.calls }
                />
                <Route
                    exact
                    component={ ReportOrdersPage }
                    path={ book.reportOrders }
                />
                <Route
                    exact
                    component={ ReportLoadKPIPage }
                    path={ book.reportLoadKPI }
                />
                { /* Payment */ }
                <Route
                    exact
                    component={ PaymentPage }
                    path={ book.paymentPage }
                />
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
                { /* Settings */ }
                <Route
                    exact
                    component={ RequisiteSettingPage }
                    path={ book.requisites }
                />
                { /* Roles */ }
                <Route
                    exact
                    component={ PackagePage }
                    path={ book.packagePage }
                />
                <Route
                    exact
                    component={ RolePage }
                    path={ book.rolePage }
                />
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
                <Route
                    exact
                    component={ BrandsPage }
                    path={ book.brandsPage }
                />
                <Route
                    exact
                    component={ AvailabilitiesPage }
                    path={ book.availabilitiesPage }
                />
                { /* Global */ }
                <Route
                    exact
                    component={ ProfilePage }
                    path={ book.profile }
                />
                <Route
                    exact
                    component={ UserAgreementPage }
                    path={ book.userAgreement }
                />
                <Route
                    component={ ExceptionPage }
                    path={ book.exceptionStatusCode }
                />
                <Route 
                    exact
                    component={ AgreementPage }
                    path={ book.agreement }
                />
                <Route 
                    exact
                    component={ SyncImportPage }
                    path={ book.syncImportPage }
                />
                <Route 
                    exact
                    component={ SyncExportPage }
                    path={ book.syncExportPage }
                />
                <Redirect exact from='/' to={ book.ordersAppointments } />
                <Redirect to={ `${book.exception}/404` } />
            </Switch>
        );
    }
}
