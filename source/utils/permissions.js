import _ from 'lodash';

// Orders
const ACCESS_ORDER_BODY = 'ACCESS_ORDER_BODY';
const ACCESS_ORDER_CALLS = 'ACCESS_ORDER_CALLS';
const ACCESS_ORDER_COMMENTS = 'ACCESS_ORDER_COMMENTS';
const ACCESS_ORDER_DETAILS = 'ACCESS_ORDER_DETAILS';
const ACCESS_ORDER_HISTORY = 'ACCESS_ORDER_HISTORY';
const ACCESS_ORDER_SERVICES = 'ACCESS_ORDER_SERVICES';
const ACCESS_ORDER_STATUS = 'ACCESS_ORDER_STATUS';
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

// Employees
const GET_EMPLOYEES = 'GET_EMPLOYEES';
const CREATE_EDIT_DELETE_EMPLOYEES = 'CREATE_EDIT_DELETE_EMPLOYEES';
const EMPLOYEES_SALARIES = 'EMPLOYEES_SALARIES';

// Clients
const GET_CLIENTS = 'GET_CLIENTS';
const CREATE_EDIT_DELETE_CLIENTS = 'CREATE_EDIT_DELETE_CLIENTS';
const CREATE_EDIT_DELETE_CLIENT_VEHICLES = 'CREATE_EDIT_DELETE_CLIENT_VEHICLES';
const FILTER_CLIENTS = 'FILTER_CLIENTS';
const GET_CLIENTS_BASIC_INFORMATION = 'GET_CLIENTS_BASIC_INFORMATION';
const GET_CLIENTS_ADDITIONAL_INFORMATION = 'GET_CLIENTS_ADDITIONAL_INFORMATION';

// Suppliers
const GET_SUPPLIERS = 'GET_SUPPLIERS';

// Cash
const ACCESS_CASH_SETTINGS = 'ACCESS_CASH_SETTINGS';
const ACCESS_CASH_ORDERS = 'ACCESS_CASH_ORDERS';
const ACCESS_CASH_ACCOUNTING = 'ACCESS_CASH_ACCOUNTING';

// Tasks
const GET_ALL_TASKS = 'GET_ALL_TASKS';

//Warehouse
const ACCESS_SUPPLIERS = 'ACCESS_SUPPLIERS';

//Accounting
const ACCESS_ACCOUNTING = 'ACCESS_ACCOUNTING';
const EDIT_CASH_ORDERS = 'EDIT_CASH_ORDERS';

// Other
const DEMO = 'DEMO';

export const permissions = Object.freeze({
    ACCESS_ORDER_BODY,
    ACCESS_ORDER_CALLS,
    ACCESS_ORDER_COMMENTS,
    ACCESS_ORDER_DETAILS,
    ACCESS_ORDER_HISTORY,
    ACCESS_ORDER_SERVICES,
    ACCESS_ORDER_STATUS,
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

    GET_EMPLOYEES,
    CREATE_EDIT_DELETE_EMPLOYEES,
    EMPLOYEES_SALARIES,

    GET_CLIENTS,
    CREATE_EDIT_DELETE_CLIENTS,
    CREATE_EDIT_DELETE_CLIENT_VEHICLES,
    FILTER_CLIENTS,
    GET_CLIENTS_BASIC_INFORMATION,
    GET_CLIENTS_ADDITIONAL_INFORMATION,

    ACCESS_CASH_SETTINGS,
    ACCESS_CASH_ORDERS,
    ACCESS_CASH_ACCOUNTING,

    GET_ALL_TASKS,

    ACCESS_SUPPLIERS,

    ACCESS_ACCOUNTING,
    EDIT_CASH_ORDERS,

    DEMO,
});

export const DASHBOARD_PERMISSIONS = 'DASHBOARD_PERMISSIONS';
export const ORDERS_PERMISSIONS = 'ORDERS_PERMISSIONS';
export const CLIENTS_PERMISSIONS = 'CLIENTS_PERMISSIONS';
export const EMPLOYEES_PERMISSIONS = 'EMPLOYEES_PERMISSIONS';
export const SUPPLIERS_PERMISSIONS = 'SUPPLIERS_PERMISSIONS';
export const CASH_PERMISSIONS = 'CASH_PERMISSIONS';
export const TASKS_PERMISSIONS = 'TASKS_PERMISSIONS';
export const WAREHOUSE_PERMISSIONS = 'WAREHOUSE_PERMISSIONS';
export const ACCOUNTING_PERMISSIONS = 'ACCOUNTING_PERMISSIONS';
export const OTHER_PERMISSIONS = 'OTHER_PERMISSIONS';

export const groupedPermissions = {
    [ DASHBOARD_PERMISSIONS ]: [
        ACCESS_DASHBOARD,
        EDIT_DASHBOARD_ORDER,
        OPEN_DASHBOARD_ORDER,
        CREATE_DASHBOARD_ORDER,
    ],
    [ ORDERS_PERMISSIONS ]: [
        ACCESS_ORDER_BODY,
        ACCESS_ORDER_CALLS,
        ACCESS_ORDER_COMMENTS,
        ACCESS_ORDER_DETAILS,
        ACCESS_ORDER_HISTORY,
        ACCESS_ORDER_SERVICES,
        ACCESS_ORDER_STATUS,
        CREATE_INVITE_ORDER,
        CREATE_ORDER,
        PRINT_ORDERS,
        SHOW_FILTERS,
        SHOW_ORDERS,
        UPDATE_SUCCESS_ORDER,
    ],
    [ CLIENTS_PERMISSIONS ]: [
        GET_CLIENTS,
        CREATE_EDIT_DELETE_CLIENTS,
        CREATE_EDIT_DELETE_CLIENT_VEHICLES,
        FILTER_CLIENTS,
        GET_CLIENTS_BASIC_INFORMATION,
        GET_CLIENTS_ADDITIONAL_INFORMATION,
    ],
    [ EMPLOYEES_PERMISSIONS ]: [ GET_EMPLOYEES, CREATE_EDIT_DELETE_EMPLOYEES, EMPLOYEES_SALARIES ],
    [ SUPPLIERS_PERMISSIONS ]: [ GET_SUPPLIERS ],
    [ CASH_PERMISSIONS ]:      [ ACCESS_CASH_SETTINGS, ACCESS_CASH_ORDERS, ACCESS_CASH_ACCOUNTING ],
    [ TASKS_PERMISSIONS ]:     [ GET_ALL_TASKS ],
    [ WAREHOUSE_PERMISSIONS ]: [ ACCESS_SUPPLIERS ],
    [ ACCOUNTING_PERMISSIONS ]: [ ACCESS_ACCOUNTING, EDIT_CASH_ORDERS ],
    [ OTHER_PERMISSIONS ]:     [ DEMO ],
};

export const isForbidden = ({ isAdmin, scope }, grant) =>
    !isAdmin && !(_.isArray(scope) && scope.includes(grant));

export const isAdmin = ({ isAdmin }) => isAdmin;

export const getGroupsLabels = intl => ({
    [ DASHBOARD_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.dashboard_permissions',
    }),
    [ TASKS_PERMISSIONS ]:   intl.formatMessage({ id: 'roles.tasks_permissions' }),
    [ CLIENTS_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.clients_permissions',
    }),
    [ EMPLOYEES_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.employees_permissions',
    }),
    [ WAREHOUSE_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.warehouse_permissions',
    }),
    [ ACCOUNTING_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.accounting_permissions',
    }),
    [ ORDERS_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.orders_permissions',
    }),
    [ OTHER_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.other_permissions',
    }),
});

export const getPermissionsLabels = intl => ({
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
    [ GET_EMPLOYEES ]: intl.formatMessage({
        id: 'roles.get_employees',
    }),
    [ CREATE_EDIT_DELETE_EMPLOYEES ]: intl.formatMessage({
        id: 'roles.create_edit_delete_employees',
    }),
    [ EMPLOYEES_SALARIES ]: intl.formatMessage({
        id: 'roles.employees_salaries',
    }),
    [ GET_CLIENTS ]: intl.formatMessage({
        id: 'roles.get_clients',
    }),
    [ CREATE_EDIT_DELETE_CLIENTS ]: intl.formatMessage({
        id: 'roles.create_edit_delete_clients',
    }),
    [ CREATE_EDIT_DELETE_CLIENT_VEHICLES ]: intl.formatMessage({
        id: 'roles.create_edit_delete_client_vehicles',
    }),
    [ FILTER_CLIENTS ]: intl.formatMessage({
        id: 'roles.filter_clients',
    }),
    [ GET_CLIENTS_BASIC_INFORMATION ]: intl.formatMessage({
        id: 'roles.get_clients_basic_information',
    }),
    [ GET_CLIENTS_ADDITIONAL_INFORMATION ]: intl.formatMessage({
        id: 'roles.get_clients_additional_information',
    }),

    [ GET_ALL_TASKS ]: intl.formatMessage({
        id: 'roles.get_all_tasks',
    }),

    [ ACCESS_SUPPLIERS ]: intl.formatMessage({
        id: 'roles.access_suppliers',
    }),

    [ ACCESS_ACCOUNTING ]: intl.formatMessage({
        id: 'roles.access_accounting',
    }),
    [ EDIT_CASH_ORDERS ]: intl.formatMessage({
        id: 'roles.edit_cash_orders',
    }),

    [ DEMO ]: intl.formatMessage({
        id: 'roles.demo',
    }),
});
