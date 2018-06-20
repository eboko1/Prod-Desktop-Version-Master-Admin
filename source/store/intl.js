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
import ProfileForm from 'forms/ProfileForm/messages';
// modals
import UniversalFiltersModal from 'modals/UniversalFiltersModal/messages';
// components
import OrdersTable from 'components/OrdersTable/messages';
import OrderStatusIcon from 'components/OrderStatusIcon/messages';
import OrderFormTables from 'components/OrderFormTables/messages';

const messages = merge.all([ global, Navigation, LanguagePad, ProfilePage, ProfileForm, OrdersContainer, OrdersPage, OrderPage, ExceptionPage, OrdersTable, OrderStatusIcon, OrdersFilterContainer, FunelContainer, Header, AddOrderPage, OrderFormTables, UniversalFiltersModal ]);

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
