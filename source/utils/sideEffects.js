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
    localStorage.setItem('_my.carbook.pro_token', token);

export const getToken = () => localStorage.getItem('_my.carbook.pro_token');

export const removeToken = () =>
    localStorage.removeItem('_my.carbook.pro_token');

export const setTireFittingToken = token =>
    localStorage.setItem('_my.carbook.tire_pro_token', token);

export const getTireFittingToken = () => localStorage.getItem('_my.carbook.tire_pro_token');

export const removeTireFittingToken = () =>
    localStorage.removeItem('_my.carbook.tire_pro_token');

// locale
const fallbackLocale =
    window.navigator.language || window.navigator.userLanguage;

export const setLocale = locale => {
    if (locale === 'ua') {
        return localStorage.setItem('_my.carbook.pro_locale', 'uk');
    }

    return localStorage.setItem('_my.carbook.pro_locale', locale);
};

export const getLocale = () =>
    localStorage.getItem('_my.carbook.pro_locale') || fallbackLocale;

export const removeLocale = () =>
    localStorage.removeItem('_my.carbook.pro_locale');

export const setLocaleProvider = () => {
    const language = getLocale();
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
        '_my.carbook.pro_layout_collapsed',
        JSON.stringify(collapsed),
    );

export const getCollapsedState = () =>
    JSON.parse(localStorage.getItem('_my.carbook.pro_layout_collapsed'));

export const removeCollapsedState = () =>
    localStorage.removeItem('_my.carbook.pro_layout_collapsed');

//
// moment
//

moment.locale(getLocale());

//
// cookies
//

export const getCookie = name => {
    const matches = document.cookie.match(
        new RegExp(
            '(?:^|; )' +
                name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
                '=([^;]*)',
        ),
    );

    return matches ? decodeURIComponent(matches[ 1 ]) : void 0;
};

export const setCookie = (name, value, props = {}) => {
    let expires = props.expires;

    if (typeof expires === 'number' && expires) {
        const date = new Date();

        date.setTime(date.getTime() + expires * 1000);

        expires = props.expires = date;
    }

    if (expires && expires.toUTCString) {
        props.expires = expires.toUTCString();
    }

    let updatedCookie = name + '=' + encodeURIComponent(value);

    /* eslint-disable guard-for-in */
    for (let propName in props) {
        updatedCookie += '; ' + propName;

        let propValue = props[ propName ];

        if (propValue !== true) {
            updatedCookie += '=' + propValue;
        }
    }

    document.cookie = updatedCookie;
};

export const deleteCookie = name => {
    setCookie(name, null, { expires: -1 });
};
