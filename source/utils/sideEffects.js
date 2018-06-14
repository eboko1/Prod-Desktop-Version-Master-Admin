// Side effects Services
import moment from 'moment';

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
export const setLocale = locale =>
    localStorage.setItem('@@my.carbook.pro/locale', locale);

export const getLocale = () => localStorage.getItem('@@my.carbook.pro/locale');

export const removeLocale = () =>
    localStorage.removeItem('@my.carbook.pro/locale');
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
