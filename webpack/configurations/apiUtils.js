export const getApiUrl = BUILD_ENV => {
    let __API_URL__ = null;

    switch (BUILD_ENV) {
        case 'production':
            __API_URL__ = JSON.stringify('https://api.carbook.pro');
            break;
        case 'stage':
            __API_URL__ = JSON.stringify('https://test-api.carbook.pro');
            break;
        case 'development':
            __API_URL__ = JSON.stringify('https://dev-api.carbook.pro');
            break;
        case 'local':
            __API_URL__ = JSON.stringify('https://dev-api.carbook.pro');
            break;
        default:
            __API_URL__ = JSON.stringify('https://api.carbook.pro');
            break;
    }

    return __API_URL__;
};
