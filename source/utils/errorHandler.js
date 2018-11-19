import _ from 'lodash';

/**
 * Convert api error to duck error
 * @param {Object} err api error
 * @param {String} source source of error
 * @returns {{source: *}} error's response status with source
 */
export const toDuckError = (err, source) => {
    if (!err || !err.response || !err.status) {
        return void 0;
    }
    const errHandlingProperties = _.pick(err, [ 'response', 'status' ]);

    return { ...errHandlingProperties, source };
};

/**
 * Get duck errors for current component
 * @param {Array<*>} errors redux ui errors
 * @param {Array<*>} errorConfigs current component error configs
 * @param {String} source source of errors
 * @returns {Array<*>} current component errors
 */
export const getCurrentDuckErrors = (errors, errorConfigs, source) => {
    const extendedErrorConfigs = errorConfigs.map(errConfig => ({
        ...errConfig,
        source,
    }));

    return errors
        .map(error => [ _.find(extendedErrorConfigs, _.omit(error, [ 'id' ])), error.id ])
        .filter(([ errorConfig ]) => errorConfig)
        .map(([{ description }, id ]) => ({ description, id }));
};

/**
 * Show notifications on errors
 * @param {Object} notification antd notification
 * @param {Array<*>} duckErrors array of errors stored in redux
 * @param {Object} intl i18n object
 * @param {Object} handleError handleError from ui duck
 * @returns {undefined}
 */
export const handleCurrentDuckErrors = (
    notification,
    duckErrors,
    intl,
    handleError,
) => {
    const openNotificationWithIcon = (type, message, description) => {
        notification[ type ]({
            message,
            description,
        });
    };

    duckErrors.forEach(({ id, description }) => {
        openNotificationWithIcon(
            'error',
            intl.formatMessage({ id: 'error' }),
            description,
        );
        handleError(id);
    });
};
