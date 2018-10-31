const DEFAULT_CONSTANTS = {
    __API_URL__:           'http://127.0.0.1:14281',
    __OLD_APP_URL__:       'http://my.cb24.uwinart.loc',
    __TECDOC_IMAGES_URL__: 'https://articles.carbook.pro/images',
};

const BUILD_ENV_TO_CONSTANTS = {
    production: {
        __API_URL__:           'https://api.carbook.pro',
        __OLD_APP_URL__:       'https://my.cb24.eu',
        __TECDOC_IMAGES_URL__: 'https://articles.carbook.pro/images',
    },
    stage: {
        __API_URL__:           'https://test-api.carbook.pro',
        __OLD_APP_URL__:       'https://test-my.cb24.eu',
        __TECDOC_IMAGES_URL__: 'https://articles.carbook.pro/images',
    },
    development: {
        __API_URL__:           'https://dev-api.carbook.pro',
        __OLD_APP_URL__:       'https://dev-my.cb24.eu',
        __TECDOC_IMAGES_URL__: 'https://articles.carbook.pro/images',
    },
    local: {
        __API_URL__:           'http://127.0.0.1:14281',
        __OLD_APP_URL__:       'http://my.cb24.uwinart.loc',
        __TECDOC_IMAGES_URL__: 'https://articles.carbook.pro/images',
    },
};

export const getConstants = BUILD_ENV => {
    const buildEnvConstans = BUILD_ENV_TO_CONSTANTS[ BUILD_ENV ];
    const constants = buildEnvConstans ? buildEnvConstans : DEFAULT_CONSTANTS;

    return constants;
};
