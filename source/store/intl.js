// vendor
import { addLocaleData } from 'react-intl';
import numeral from 'numeral';
import merge from 'deepmerge';

// Locale data
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';

addLocaleData([ ...ru, ...en, ...uk ]);

// Module locales
import Storage from 'locales/storage.json';

// Messages
import global from 'utils/messages';
import errorMessage from 'core/errorMessage/messages';
// commons
import Header from 'commons/Header/messages';
import Navigation from 'commons/Navigation/messages';
// pages
import ExceptionPage from 'pages/ExceptionPage/messages';
import ProfilePage from 'pages/ProfilePage/messages';
import AddOrderPage from 'pages/AddOrderPage/messages';
import OrderPage from 'pages/OrderPage/messages';
import OrdersPage from 'pages/OrdersPage/messages';
import DashboardPage from 'pages/DashboardPage/messages';
import RolePage from 'pages/RolePage/messages';
import PackagePage from 'pages/PackagePage/messages';
import ClientsPage from 'pages/ClientsPage/messages';
import CashClientsDebtsPage from 'pages/CashClientsDebtsPage/messages';
import EmployeesPage from 'pages/EmployeesPage/messages';
import AddEmployeePage from 'pages/AddEmployeePage/messages';
import ChartPage from 'pages/ChartPage/messages';
import ReviewsPage from 'pages/ReviewsPage/messages';
import ReviewPage from 'pages/ReviewPage/messages';
import CallsPage from 'pages/CallsPage/messages';
import BusinessPackagePage from 'pages/BusinessPackagePage/messages';
import ManagerRolePage from 'pages/ManagerRolePage/messages';
import DiagnosticPatternsPage from 'pages/DiagnosticPatternsPage/messages';
import AgreementPage from 'pages/AgreementPage/messages';
import AvailabilitiesPage from 'pages/AvailabilitiesPage/messages';
import RequisiteSettingPage from 'pages/RequisiteSettingPage/messages';
import NewDocumentPage from 'pages/NewDocumentPage/messages';
import SupplierPage from 'pages/SupplierPage/messages';
import ReportOrdersPage from 'pages/Reports/ReportOrdersPage/messages';
import ReportAnalyticsPage from 'pages/Reports/ReportAnalyticsPage/messages';
import ReportLoadKPIPage from 'pages/Reports/ReportLoadKPIPage/messages';
import ReportCashFlowPage from 'pages/Reports/ReportCashFlowPage/messages';
import RepairMapSettingPage from 'pages/RepairMapSettingPage/messages';
import Locations from 'pages/Locations/messages';
import SyncImportExport from 'pages/SyncImportExport/messages';

// containers
import OrdersFilterContainer from 'containers/OrdersFilterContainer/messages';
import OrdersContainer from 'containers/OrdersContainer/messages';
import MyTasksContainer from 'containers/MyTasksContainer/messages';
import PackageContainer from 'containers/PackageContainer/messages';
import BusinessPackageContainer from 'containers/BusinessPackageContainer/messages';
import RoleContainer from 'containers/RoleContainer/messages';
import SettingSalaryForm from 'forms/SettingSalaryForm/messages';
import ManagerRoleContainer from 'containers/ManagerRoleContainer/messages';
import UniversalFiltersContainer from 'containers/UniversalFilters/messages';
import ClientContainer from 'containers/ClientContainer/messages';
import ClientRequisitesContainer from 'containers/ClientRequisitesContainer/messages';
import ClientsContainer from 'containers/ClientsContainer/messages';
import ReviewsContainer from 'containers/ReviewsContainer/messages';
import StorageDocumentsContainer from 'containers/StorageDocumentsContainer/messages';

// forms
import DecoratedDatePicker from 'forms/DecoratedFields/DecoratedDatePicker/messages';
import ProfileForm from 'forms/ProfileForm/messages';
import UniversalFiltersForm from 'forms/UniversalFiltersForm/messages';
import AddPackageForm from 'forms/AddPackageForm/messages';
import PackageForm from 'forms/PackageForm/messages';
import AddRoleForm from 'forms/AddRoleForm/messages';
import RoleForm from 'forms/RoleForm/messages';
import SwitchBusinessForm from 'forms/SwitchBusinessForm/messages';
import EmployeeForm from 'forms/EmployeeForm/messages';
import EmployeeScheduleForm from 'forms/EmployeeScheduleForm/messages';
import BusinessPackageForm from 'forms/BusinessPackageForm/messages';
import ManagerRoleForm from 'forms/ManagerRoleForm/messages';
import AddBusinessPackageForm from 'forms/AddBusinessPackageForm/messages';
import LoginForm from 'forms/LoginForm/messages';
import SalaryReportForm from 'forms/SalaryReportForm/messages';
import BrandsForm from 'forms/BrandsForm/messages';
import SetDetailProductForm from 'forms/SetDetailProductForm/messages';
import SpreadBusinessBrandsForm from 'forms/SpreadBusinessBrandsForm/messages';
import CashCreationForm from 'forms/CashCreationForm/messages';
import CashOrderForm from 'forms/CashOrderForm/messages';
import ReportOrdersFilterForm from 'forms/ReportForms/ReportOrdersFilterForm/messages';
import ReportAnalyticsForm from 'forms/ReportForms/ReportAnalyticsForms/messages';

// OrderForm
import OrderForm from 'forms/OrderForm/messages';
import AbstractClientForm from 'forms/AbstractClientForm/messages';
import OrderTaskForm from 'forms/OrderTaskForm/messages';
import OrderFormTables from 'forms/OrderForm/OrderFormTables/messages';
import TasksTable from 'forms/OrderForm/OrderFormTables/TasksTable/messages';
import CallsTable from 'forms/OrderForm/OrderFormTables/CallsTable/messages';
import CancelReasonForm from 'forms/CancelReasonForm/messages';
import ToSuccessForm from 'forms/ToSuccessForm/messages';
import DiagnosticTable from 'forms/OrderForm/OrderFormTables/DiagnosticTable/messages';

// modals
import UniversalFiltersModal from 'modals/UniversalFiltersModal/messages';
import OrderTaskModal from 'modals/OrderTaskModal/messages';
import AddClientModal from 'modals/AddClientModal/messages';
import InviteModal from 'modals/InviteModal/messages';
import UniversalChartModal from 'modals/UniversalChartModal/messages';
import ConfirmRescheduleModal from 'modals/ConfirmRescheduleModal/messages';
import SupplierModal from 'modals/SupplierModal/messages';
import TecDocInfoModal from 'modals/TecDocInfoModal/messages'
import VehicleLocationModal from 'modals/VehicleLocationModal/messages';
import ReportOrdersExportModal from 'modals/ReportModals/ReportOrdersExportModal/messages';
import ReportAnalyticsModal from 'modals/ReportModals/ReportAnalyticsModal/messages'

// components
import StatusIcons from 'components/StatusIcons/messages';
import StatsCountsPanel from 'components/StatsCountsPanel/messages';
import ReportsDropdown from 'components/ReportsDropdown/messages';
import UniversalFiltersTags from 'components/UniversalFiltersTags/messages';
import EmployeesTable from 'components/EmployeesTable/messages';
import SettingSalaryTable from 'components/SettingSalaryTable/messages';
import ArrayScheduleInput from 'components/ArrayScheduleInput/messages';
import ArrayBreakScheduleInput from 'components/ArrayBreakScheduleInput/messages';
import ChangeStatusDropdown from 'components/ChangeStatusDropdown/messages';
import ClientFeedbackTab from 'components/ClientFeedbackTab/messages';
import ClientOrdersTab from 'components/ClientOrdersTab/messages';
import ClientMRDsTab from 'components/ClientMRDsTab/messages';
import EmployeeFeedback from 'components/EmployeeFeedback/messages';
import EmployeeStatistics from 'components/EmployeeStatistics/messages';
import ReviewsTable from 'components/ReviewsTable/messages';
import ReviewResponse from 'components/ReviewResponse/messages';
import StatisticsCallsTable from 'components/CallsTable/messages';
import CallsStatistics from 'components/CallsStatistics/messages';
import PartSuggestions from 'components/PartSuggestions/messages';
import PartAttributes from 'components/PartAttributes/messages';
import VehicleNumberHistory from 'components/VehicleNumberHistory/messages';
import CashTables from 'components/Tables/CashTables/messages';
import SubscriptionTables from 'components/Tables/SubscriptionTables/messages';
import ClientMRDsTable from 'components/Tables/ClientMRDsTable/messages';
import ReportOrdersTable from 'components/Tables/ReportTables/messages';
import SubscribeForm from 'forms/SubscribeForm/messages';

//commons
import Footer from 'commons/Footer/messages';

/* eslint-disable array-element-newline */
const messages = merge.all([
    global,
    errorMessage,
    
    //locales
    Storage,

    // commons
    Navigation,
    Header,
    Footer,

    // pages
    ProfilePage,
    OrdersPage,
    OrderPage,
    ExceptionPage,
    AddOrderPage,
    DashboardPage,
    RolePage,
    PackagePage,
    ClientsPage,
    CashClientsDebtsPage,
    EmployeesPage,
    AddEmployeePage,
    ChartPage,
    ReviewsPage,
    ReviewPage,
    CallsPage,
    BusinessPackagePage,
    ManagerRolePage,
    DiagnosticPatternsPage,
    AgreementPage,
    AvailabilitiesPage,
    RequisiteSettingPage,
    NewDocumentPage,
    SupplierPage,
    ReportOrdersPage,
    ReportAnalyticsPage,
    ReportLoadKPIPage,
    ReportCashFlowPage,
    RepairMapSettingPage,
    Locations,
    SyncImportExport,

    // containers
    OrdersContainer,
    OrdersFilterContainer,
    MyTasksContainer,
    PackageContainer,
    RoleContainer,
    SettingSalaryForm,
    BusinessPackageContainer,
    ManagerRoleContainer,
    UniversalFiltersContainer,
    ClientsContainer,
    ClientContainer,
    ClientRequisitesContainer,
    ReviewsContainer,
    StorageDocumentsContainer,

    // forms
    ProfileForm,
    UniversalFiltersForm,
    OrderForm,
    CancelReasonForm,
    ToSuccessForm,
    AbstractClientForm,
    OrderTaskForm,
    AddPackageForm,
    PackageForm,
    AddRoleForm,
    RoleForm,
    SwitchBusinessForm,
    EmployeeForm,
    BusinessPackageForm,
    AddBusinessPackageForm,
    ManagerRoleForm,
    LoginForm,
    SalaryReportForm,
    BrandsForm,
    SetDetailProductForm,
    SpreadBusinessBrandsForm,
    CashCreationForm,
    CashOrderForm,
    SubscribeForm,
    DiagnosticTable,
    ReportOrdersFilterForm,
    ReportAnalyticsForm,

    // modals
    UniversalFiltersModal,
    AddClientModal,
    InviteModal,
    OrderTaskModal,
    UniversalChartModal,
    ConfirmRescheduleModal,
    SupplierModal,
    TecDocInfoModal,
    VehicleLocationModal,
    ReportOrdersExportModal,
    ReportAnalyticsModal,

    // components
    StatusIcons,
    OrderFormTables,
    StatsCountsPanel,
    UniversalFiltersTags,
    TasksTable,
    ReportsDropdown,
    DecoratedDatePicker,
    CallsTable,
    EmployeesTable,
    EmployeeScheduleForm,
    SettingSalaryTable,
    ArrayScheduleInput,
    ArrayBreakScheduleInput,
    ChangeStatusDropdown,
    ClientFeedbackTab,
    ClientOrdersTab,
    ClientMRDsTab,
    EmployeeFeedback,
    EmployeeStatistics,
    ReviewsTable,
    ReviewResponse,
    StatisticsCallsTable,
    CallsStatistics,
    PartSuggestions,
    PartAttributes,
    VehicleNumberHistory,
    CashTables,
    ClientMRDsTable,
    ReportOrdersTable,
    SubscriptionTables,
]);
/* eslint-enable array-element-newline */

// Intl
const fallbackLocale =
    window.navigator.language || window.navigator.userLanguage === 'uk_UA'
        ? 'uk'
        : 'ru';

const setIntl = language => {
    let locale = language;
    if (locale === 'ua') {
        locale = 'uk';
    }

    return {
        locale:   locale || fallbackLocale,
        messages: messages[ locale || fallbackLocale ],
    };
};

let persistedLocale =
    localStorage.getItem('_my.carbook.pro_locale') || fallbackLocale;

if (persistedLocale === 'ua') {
    persistedLocale = 'uk';
}

const intl = setIntl(persistedLocale);

// Numeral
// TODO: provide locale dynamic for numeral register
numeral.register('locale', 'ru', {
    delimiters: {
        thousands: ' ',
        decimal:   ',',
    },
    abbreviations: {
        thousand: 'тыс.',
        million:  'мил.',
        billion:  'бил.',
        trillion: 'трил.',
    },
    ordinal:  () => '.',
    currency: {
        symbol: '₴',
    },
});
numeral.locale('ru');

export { messages, intl, setIntl };
