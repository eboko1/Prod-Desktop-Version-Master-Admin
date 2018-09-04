// Side effects Services
/* eslint-disable camelcase */
import en_GB from 'antd/lib/locale-provider/en_GB';
import ru_RU from 'antd/lib/locale-provider/ru_RU';
import uk_UA from 'antd/lib/locale-provider/uk_UA';
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import 'moment/locale/uk';

//
// localStorage
//
// token
export const setToken = token =>
    localStorage.setItem('@@my.carbook.pro/token', token);

export const getToken = () => localStorage.getItem('@@my.carbook.pro/token');

export const removeToken = () =>
    localStorage.removeItem('@@my.carbook.pro/token');
// locale
export const setLocale = locale => {
    if (locale === 'ua') {
        return localStorage.setItem('@@my.carbook.pro/locale', 'uk');
    }

    return localStorage.setItem('@@my.carbook.pro/locale', locale);
};

export const getLocale = () => localStorage.getItem('@@my.carbook.pro/locale');

export const removeLocale = () =>
    localStorage.removeItem('@my.carbook.pro/locale');

export const setLocaleProvider = () => {
    const language = getLocale();
    console.log('→ language', language);
    switch (language) {
        case 'en':
            return en_GB;
        case 'ru':
            return ru_RU;
        case 'uk':
            return uk_UA;
        default:
            return ru_RU;
    }
};
// ui
export const setCollapsedState = collapsed =>
    localStorage.setItem(
        '@@my.carbook.pro/layout/collapsed',
        JSON.stringify(collapsed),
    );

export const getCollapsedState = () =>
    JSON.parse(localStorage.getItem('@@my.carbook.pro/layout/collapsed'));

export const removeCollapsedState = () =>
    localStorage.removeItem('@@my.carbook.pro/layout/collapsed');

//
// moment
//
const locale = window.navigator.userLanguage || window.navigator.language;
moment.locale(locale);
