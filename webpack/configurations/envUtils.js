const DEFAULT_CONSTANTS = {
    __API_URL__:    'http://127.0.0.1:14281',
    __OLD_UI_URL__: 'http://127.0.0.1:3001',
};

const BUILD_ENV_TO_CONSTANTS = {
    production: {
        __API_URL__:    'https://api.carbook.pro',
        __OLD_UI_URL__: 'https://cb24.eu',
    },
    stage: {
        __API_URL__:    'https://test-api.carbook.pro',
        __OLD_UI_URL__: 'https://test.cb24.eu',
    },
    development: {
        __API_URL:      'https://dev-api.carbook.pro',
        __OLD_UI_URL__: 'https://dev.cb24.eu',
    },
    local: {
        __API_URL__:    'https://dev-api.carbook.pro',
        __OLD_UI_URL__: 'http://my.cb24.uwinart.loc',
    },
};


export const getConstants = BUILD_ENV => {
    const buildEnvConstans = BUILD_ENV_TO_CONSTANTS[ BUILD_ENV ];
    const constants = buildEnvConstans ? buildEnvConstans : DEFAULT_CONSTANTS;

    return constants;
};
