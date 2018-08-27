// Core
import { addLocaleData } from 'react-intl';
import numeral from 'numeral';
import merge from 'deepmerge';

// Proj
import { getLocale } from 'utils';

// Locale data
import ru from 'react-intl/locale-data/ru';
import uk from 'react-intl/locale-data/uk';
import en from 'react-intl/locale-data/en';

addLocaleData([ ...ru, ...en, ...uk ]);

// Messages
import global from 'utils/messages';
// commons
import Header from 'commons/Header/messages';
import Navigation from 'commons/Navigation/messages';
import LanguagePad from 'components/LanguagePad/messages';
// pages
import ExceptionPage from 'pages/ExceptionPage/messages';
import ProfilePage from 'pages/ProfilePage/messages';
import AddOrderPage from 'pages/AddOrderPage/messages';
import OrderPage from 'pages/OrderPage/messages';
import OrdersPage from 'pages/OrdersPage/messages';
import DashboardPage from 'pages/DashboardPage/messages';
import RolePage from 'pages/RolePage/messages';
import PackagePage from 'pages/PackagePage/messages';
import EmployeePage from 'pages/EmployeePage/messages';
import AddEmployeePage from 'pages/AddEmployeePage/messages';

import BusinessPackagePage from 'pages/BusinessPackagePage/messages';
import ManagerRolePage from 'pages/ManagerRolePage/messages';
// containers
import OrdersFilterContainer from 'containers/OrdersFilterContainer/messages';
import FunelContainer from 'containers/FunelContainer/messages';
import OrdersContainer from 'containers/OrdersContainer/messages';
import MyTasksContainer from 'containers/MyTasksContainer/messages';
import PackageContainer from 'containers/PackageContainer/messages';
import BusinessPackageContainer from 'containers/BusinessPackageContainer/messages';
import RoleContainer from 'containers/RoleContainer/messages';
import SettingSalaryContainer from 'containers/SettingSalaryContainer/messages';
import ManagerRoleContainer from 'containers/ManagerRoleContainer/messages';

// forms
import DecoratedDatePicker from 'forms/DecoratedFields/DecoratedDatePicker/messages';
import ProfileForm from 'forms/ProfileForm/messages';
import OrderForm from 'forms/OrderForm/messages';
import UniversalFiltersForm from 'forms/UniversalFiltersForm/messages';
import AddClientForm from 'forms/AddClientForm/messages';
import CancelReasonForm from 'forms/CancelReasonForm/messages';
import ToSuccessForm from 'forms/ToSuccessForm/messages';
import OrderTaskForm from 'forms/OrderTaskForm/messages';
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

// modals
import UniversalFiltersModal from 'modals/UniversalFiltersModal/messages';
import OrderTaskModal from 'modals/OrderTaskModal/messages';
import AddClientModal from 'modals/AddClientModal/messages';
import InviteModal from 'modals/InviteModal/messages';
// components
import StatusIcons from 'components/StatusIcons/messages';
import OrderFormTables from 'components/OrderForm/OrderFormTables/messages';
import CallsTable from 'components/OrderForm/OrderFormTables/CallsTable/messages';
import StatsCountsPanel from 'components/StatsCountsPanel/messages';
import ReportsDropdown from 'components/ReportsDropdown/messages';
import UniversalFiltersTags from 'components/UniversalFiltersTags/messages';
import TasksTable from 'components/OrderForm/OrderFormTables/TasksTable/messages';
import EmployeeTable from 'components/EmployeeTable/messages';
import SettingSalaryTable from 'components/SettingSalaryTable/messages';

/* eslint-disable array-element-newline */
const messages = merge.all([
    global,
    // commons
    Navigation,
    Header,
    LanguagePad,
    // pages
    ProfilePage,
    OrdersPage,
    OrderPage,
    ExceptionPage,
    AddOrderPage,
    DashboardPage,
    RolePage,
    PackagePage,
    EmployeePage,
    AddEmployeePage,
    BusinessPackagePage,
    ManagerRolePage,
    // containers
    OrdersContainer,
    OrdersFilterContainer,
    FunelContainer,
    MyTasksContainer,
    PackageContainer,
    RoleContainer,
    SettingSalaryContainer,
    BusinessPackageContainer,
    ManagerRoleContainer,
    // forms
    ProfileForm,
    UniversalFiltersForm,
    OrderForm,
    CancelReasonForm,
    ToSuccessForm,
    AddClientForm,
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
    // modals
    UniversalFiltersModal,
    AddClientModal,
    InviteModal,
    OrderTaskModal,
    // components
    StatusIcons,
    OrderFormTables,
    StatsCountsPanel,
    UniversalFiltersTags,
    TasksTable,
    ReportsDropdown,
    DecoratedDatePicker,
    CallsTable,
    EmployeeTable,
    EmployeeScheduleForm,
    SettingSalaryTable,
]);
/* eslint-enable array-element-newline */

// Intl
const fallbackLocale = window.navigator.language === 'uk_UA' ? 'uk' : 'ru';

const persistedLocale = getLocale();

const intl = {
    locale:   persistedLocale || fallbackLocale,
    messages: messages[ persistedLocale || fallbackLocale ],
};

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

export { messages, intl };
