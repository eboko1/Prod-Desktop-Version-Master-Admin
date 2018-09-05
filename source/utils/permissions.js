import _ from 'lodash';

// Orders
const ACCESS_ORDER_BODY = 'ACCESS_ORDER_BODY';
const ACCESS_ORDER_CALLS = 'ACCESS_ORDER_CALLS';
const ACCESS_ORDER_COMMENTS = 'ACCESS_ORDER_COMMENTS';
const ACCESS_ORDER_DETAILS = 'ACCESS_ORDER_DETAILS';
const ACCESS_ORDER_HISTORY = 'ACCESS_ORDER_HISTORY';
const ACCESS_ORDER_SERVICES = 'ACCESS_ORDER_SERVICES';
const ACCESS_ORDER_STATUS = 'ACCESS_ORDER_STATUS';
const ACCESS_ORDER_TASKS = 'ACCESS_ORDER_TASKS';
const CREATE_INVITE_ORDER = 'CREATE_INVITE_ORDER';
const CREATE_ORDER = 'CREATE_ORDER';
const GRANT = 'GRANT';
const PRINT_ORDERS = 'PRINT_ORDERS';
const SHOW_FILTERS = 'SHOW_FILTERS';
const SHOW_ORDERS = 'SHOW_ORDERS';
const UPDATE_SUCCESS_ORDER = 'UPDATE_SUCCESS_ORDER';

// Dashboard
const ACCESS_DASHBOARD = 'ACCESS_DASHBOARD';
const EDIT_DASHBOARD_ORDER = 'EDIT_DASHBOARD_ORDER';
const OPEN_DASHBOARD_ORDER = 'OPEN_DASHBOARD_ORDER';
const CREATE_DASHBOARD_ORDER = 'CREATE_DASHBOARD_ORDER';

export const permissions = Object.freeze({
    ACCESS_ORDER_BODY,
    ACCESS_ORDER_CALLS,
    ACCESS_ORDER_COMMENTS,
    ACCESS_ORDER_DETAILS,
    ACCESS_ORDER_HISTORY,
    ACCESS_ORDER_SERVICES,
    ACCESS_ORDER_STATUS,
    ACCESS_ORDER_TASKS,
    CREATE_INVITE_ORDER,
    CREATE_ORDER,
    GRANT,
    PRINT_ORDERS,
    SHOW_FILTERS,
    SHOW_ORDERS,
    UPDATE_SUCCESS_ORDER,

    ACCESS_DASHBOARD,
    EDIT_DASHBOARD_ORDER,
    OPEN_DASHBOARD_ORDER,
    CREATE_DASHBOARD_ORDER,
});

export const isForbidden = ({ isAdmin, scope }, grant) =>
    !isAdmin && !(_.isArray(scope) && scope.includes(grant));

export const isAdmin = ({ isAdmin }) => isAdmin;

export const rolesOptionValues = intl => ({
    [ ACCESS_ORDER_BODY ]:  intl.formatMessage({ id: 'roles.access_order_body' }),
    [ ACCESS_ORDER_CALLS ]: intl.formatMessage({
        id: 'roles.access_order_calls',
    }),
    [ ACCESS_ORDER_COMMENTS ]: intl.formatMessage({
        id: 'roles.access_order_comments',
    }),
    [ ACCESS_ORDER_DETAILS ]: intl.formatMessage({
        id: 'roles.access_order_details',
    }),
    [ ACCESS_ORDER_HISTORY ]: intl.formatMessage({
        id: 'roles.access_order_history',
    }),
    [ ACCESS_ORDER_SERVICES ]: intl.formatMessage({
        id: 'roles.access_order_services',
    }),
    [ ACCESS_ORDER_STATUS ]: intl.formatMessage({
        id: 'roles.access_order_status',
    }),
    [ ACCESS_ORDER_TASKS ]: intl.formatMessage({
        id: 'roles.access_order_tasks',
    }),
    [ CREATE_INVITE_ORDER ]: intl.formatMessage({
        id: 'roles.create_invite_order',
    }),
    [ CREATE_ORDER ]:         intl.formatMessage({ id: 'roles.create_order' }),
    [ PRINT_ORDERS ]:         intl.formatMessage({ id: 'roles.print_orders' }),
    [ SHOW_FILTERS ]:         intl.formatMessage({ id: 'roles.show_filters' }),
    [ SHOW_ORDERS ]:          intl.formatMessage({ id: 'roles.show_orders' }),
    [ UPDATE_SUCCESS_ORDER ]: intl.formatMessage({
        id: 'roles.update_success_order',
    }),

    [ ACCESS_DASHBOARD ]:     intl.formatMessage({ id: 'roles.access_dashboard' }),
    [ EDIT_DASHBOARD_ORDER ]: intl.formatMessage({
        id: 'roles.edit_dashboard_order',
    }),
    [ OPEN_DASHBOARD_ORDER ]: intl.formatMessage({
        id: 'roles.open_dashboard_order',
    }),
    [ CREATE_DASHBOARD_ORDER ]: intl.formatMessage({
        id: 'roles.create_dashboard_order',
    }),
});
