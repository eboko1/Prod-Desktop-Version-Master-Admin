import _ from 'lodash';

export const permissions = Object.freeze({
    ACCESS_ORDER_BODY:     'ACCESS_ORDER_BODY',
    ACCESS_ORDER_CALLS:    'ACCESS_ORDER_CALLS',
    ACCESS_ORDER_COMMENTS: 'ACCESS_ORDER_COMMENTS',
    ACCESS_ORDER_DETAILS:  'ACCESS_ORDER_DETAILS',
    ACCESS_ORDER_HISTORY:  'ACCESS_ORDER_HISTORY',
    ACCESS_ORDER_SERVICES: 'ACCESS_ORDER_SERVICES',
    ACCESS_ORDER_STATUS:   'ACCESS_ORDER_STATUS',
    ACCESS_ORDER_TASKS:    'ACCESS_ORDER_TASKS',
    CREATE_INVITE_ORDER:   'CREATE_INVITE_ORDER',
    CREATE_ORDER:          'CREATE_ORDER',
    GRANT:                 'GRANT',
    PRINT_ORDERS:          'PRINT_ORDERS',
    SHOW_FILTERS:          'SHOW_FILTERS',
    SHOW_ORDERS:           'SHOW_ORDERS',
    UPDATE_SUCCESS_ORDER:  'UPDATE_SUCCESS_ORDER',
});

export const isForbidden = ({ isAdmin, scope }, grant) =>
    !isAdmin && !(_.isArray(scope) && scope.includes(grant));

export const isAdmin = ({ isAdmin }) => isAdmin;
