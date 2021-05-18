import OrdersPage from './OrdersPage';
import OrderPage from './OrderPage';
import ProfilePage from './ProfilePage';
import ExceptionPage from './ExceptionPage';
import AddOrderPage from './AddOrderPage';
import DashboardPage from './DashboardPage';
import LoginPage from './LoginPage';
import MyTasksPage from './MyTasksPage';
import PackagePage from './PackagePage';
import RolePage from './RolePage';
import ClientsPage from './ClientsPage';
import EmployeesPage from './EmployeesPage';
import AddEmployeePage from './AddEmployeePage';
import EditEmployeePage from './EditEmployeePage';
import BusinessPackagePage from './BusinessPackagePage';
import ManagerRolePage from './ManagerRolePage';
import ClientPage from './ClientPage';
import ReviewsPage from './ReviewsPage';
import ReviewPage from './ReviewPage';
import CallsPage from './CallsPage';
import ChartPage from './ChartPage';
import BrandsPage from './BrandsPage';
import ServicesPage from './ServicesPage';
import LaborsPage from './LaborsPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import NewPasswordPage from './NewPasswordPage';
import CashSettingsPage from './CashSettingsPage';
import CashFlowPage from './CashFlowPage';
import CashClientsDebtsPage from './CashClientsDebtsPage';
import ClientHotOperationsPage from './ClientHotOperationsPage';
import CashBankPage from './CashBankPage';
import SuppliersPage from './SuppliersPage';
import PaymentPage from './PaymentPage';
import SubscriptionHistoryPage from './SubscriptionHistoryPage';
import SubscriptionPackagesPage from './SubscriptionPackagesPage';
import UserAgreementPage from './UserAgreementPage';
import DiagnosticPatternsPage from './DiagnosticPatternsPage';
import AgreementPage from './AgreementPage';
import AvailabilitiesPage from './AvailabilitiesPage';
import RequisiteSettingPage from './RequisiteSettingPage';
import NewDocumentPage from './NewDocumentPage';
import SupplierPage from './SupplierPage';
import RepairMapSettingPage from './RepairMapSettingPage';
import BarcodePage from './BarcodePage';
import ProductPage from './ProductPage';
import WMSPage from './WMSPage';
import VehiclePage from './VehiclePage';
import VehiclesPage from './VehiclesPage';
import DirectoriesPage from './DirectoriesPage';

// re-exports (*) must be before ES6 other (default) exports
// webpack issue: https://github.com/webpack/webpack/issues/3509
export * from './Storage';
export * from './Locations';
export * from './SyncImportExport';
export * from './Reports';

export {
    DashboardPage,
    OrdersPage,
    OrderPage,
    AddOrderPage,
    ProfilePage,
    ExceptionPage,
    LoginPage,
    MyTasksPage,
    PackagePage,
    RolePage,
    EmployeesPage,
    AddEmployeePage,
    EditEmployeePage,
    BusinessPackagePage,
    ManagerRolePage,
    ClientsPage,
    ClientPage,
    ReviewsPage,
    ReviewPage,
    CallsPage,
    ChartPage,
    BrandsPage,
    ServicesPage,
    LaborsPage,
    ForgotPasswordPage,
    NewPasswordPage,
    CashSettingsPage,
    CashFlowPage,
    CashClientsDebtsPage,
    ClientHotOperationsPage,
    CashBankPage,
    SuppliersPage,
    PaymentPage,
    SubscriptionHistoryPage,
    SubscriptionPackagesPage,
    UserAgreementPage,
    DiagnosticPatternsPage,
    AgreementPage,
    AvailabilitiesPage,
    RequisiteSettingPage,
    NewDocumentPage,
    SupplierPage,
    RepairMapSettingPage,
    BarcodePage,
    ProductPage,
    WMSPage,
    VehiclePage,
    VehiclesPage,
    DirectoriesPage,
};
