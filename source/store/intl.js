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
// containers
import OrdersFilterContainer from 'containers/OrdersFilterContainer/messages';
import FunelContainer from 'containers/FunelContainer/messages';
import OrdersContainer from 'containers/OrdersContainer/messages';
// forms
import DecoratedDatePicker from 'forms/DecoratedFields/DecoratedDatePicker/messages';
import ProfileForm from 'forms/ProfileForm/messages';
import AddOrderForm from 'forms/AddOrderForm/messages';
import UniversalFiltersForm from 'forms/UniversalFiltersForm/messages';
import CancelReasonForm from 'forms/CancelReasonForm/messages';
import ToSuccessForm from 'forms/ToSuccessForm/messages';
// modals
import UniversalFiltersModal from 'modals/UniversalFiltersModal/messages';
import AddClientModal from 'modals/AddClientModal/messages';
import InviteModal from 'modals/InviteModal/messages';
// components
import OrdersTable from 'components/OrdersTable/messages';
import StatusIcons from 'components/StatusIcons/messages';
import OrderFormTables from 'components/OrderFormTables/messages';
import CallsTable from 'components/OrderFormTables/CallsTable/messages';
import StatsCountsPanel from 'components/StatsCountsPanel/messages';
import ReportsDropdown from 'components/ReportsDropdown/messages';

const messages = merge.all([ global, Navigation, LanguagePad, ProfilePage, ProfileForm, OrdersContainer, OrdersPage, OrderPage, ExceptionPage, OrdersTable, StatusIcons, OrdersFilterContainer, FunelContainer, Header, AddOrderPage, OrderFormTables, UniversalFiltersModal, StatsCountsPanel, UniversalFiltersForm, AddOrderForm, ReportsDropdown, AddClientModal, InviteModal, DecoratedDatePicker, CancelReasonForm, ToSuccessForm, CallsTable ]);

// Intl
const fallbackLocale = window.navigator.language === 'uk_UA' ? 'uk' : 'ru';

const persistedLocale = getLocale();

const intl = {
    locale:   persistedLocale || fallbackLocale,
    messages: messages[ persistedLocale || fallbackLocale ],
};

// Numeral
// TODO: provide locale dynamic
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
