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
const LIMITED_PRINT = 'LIMITED_PRINT';
const SHOW_FILTERS = 'SHOW_FILTERS';
const SHOW_ORDERS = 'SHOW_ORDERS';
const UPDATE_SUCCESS_ORDER = 'UPDATE_SUCCESS_ORDER';

// Dashboard
const ACCESS_DASHBOARD = 'ACCESS_DASHBOARD';
const EDIT_DASHBOARD_ORDER = 'EDIT_DASHBOARD_ORDER';
const OPEN_DASHBOARD_ORDER = 'OPEN_DASHBOARD_ORDER';
const CREATE_DASHBOARD_ORDER = 'CREATE_DASHBOARD_ORDER';
const RESCHEDULE_ORDERS = 'RESCHEDULE_ORDERS';

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

// Tasks
const GET_TASKS = 'GET_TASKS';
const GET_ALL_TASKS = 'GET_ALL_TASKS';

//Warehouse
const ACCESS_SUPPLIERS = 'ACCESS_SUPPLIERS';
const ACCESS_STORE_GROUPS = 'ACCESS_STORE_GROUPS';
const ACCESS_PRICE_GROUPS = 'ACCESS_PRICE_GROUPS';
const ACCESS_STORE_PRODUCTS = 'ACCESS_STORE_PRODUCTS';
const EDIT_STORE_PRODUCT_PRICE = 'EDIT_STORE_PRODUCT_PRICE';
const ACCESS_INCOME_STORE_DOCS = 'ACCESS_INCOME_STORE_DOCS';
const ACCESS_EXPENSE_STORE_DOCS = 'ACCESS_EXPENSE_STORE_DOCS';
const SEARCH_STORE_PRODUCT = 'SEARCH_STORE_PRODUCT';
const SEARCH_STORE_PRODUCT_WITH_PRICE = 'SEARCH_STORE_PRODUCT_WITH_PRICE';
const VIEW_STORE = 'VIEW_STORE';
const VIEW_STORE_WITH_PRICE = 'VIEW_STORE_WITH_PRICE';

//Accounting
const ACCESS_ACCOUNTING = 'ACCESS_ACCOUNTING';
const EDIT_CASH_ORDERS = 'EDIT_CASH_ORDERS';

//Reports
const ACCESS_KPI = 'ACCESS_KPI';
const ACCESS_FEEDBACK = 'ACCESS_FEEDBACK';
const ACCESS_CALL_STATISTICS = 'ACCESS_CALL_STATISTICS';

//Mobi
const ACCESS_ORDER_DIAGNOSTICS = 'ACCESS_ORDER_DIAGNOSTICS';
const ACCESS_LABOR_CATALOGUE = 'ACCESS_LABOR_CATALOGUE';
const ACCESS_DIAGNOSTIC_CATALOGUE = 'ACCESS_DIAGNOSTIC_CATALOGUE';
const ACCESS_TECDOC_MODAL_WINDOW = 'ACCESS_TECDOC_MODAL_WINDOW';
const ACCESS_SUPPLIER_MODAL_WINDOW = 'ACCESS_SUPPLIER_MODAL_WINDOW';
const ACCESS_NORM_HOURS_MODAL_WINDOW = 'ACCESS_NORM_HOURS_MODAL_WINDOW';
const ACCESS_TECH_AUTO_DATA_MODAL_WINDOW = 'ACCESS_TECH_AUTO_DATA_MODAL_WINDOW';
const ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW = 'ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW';
const ACCESS_AGREEMENT = 'ACCESS_AGREEMENT';
const ACCESS_TELEGRAM = 'ACCESS_TELEGRAM';
const ACCESS_ORDER_CHANGE_AGREEMENT_STATUS = 'ACCESS_ORDER_CHANGE_AGREEMENT_STATUS';

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
    LIMITED_PRINT,
    SHOW_FILTERS,
    SHOW_ORDERS,
    UPDATE_SUCCESS_ORDER,

    ACCESS_DASHBOARD,
    EDIT_DASHBOARD_ORDER,
    OPEN_DASHBOARD_ORDER,
    CREATE_DASHBOARD_ORDER,
    RESCHEDULE_ORDERS,

    GET_EMPLOYEES,
    CREATE_EDIT_DELETE_EMPLOYEES,
    EMPLOYEES_SALARIES,

    GET_CLIENTS,
    CREATE_EDIT_DELETE_CLIENTS,
    CREATE_EDIT_DELETE_CLIENT_VEHICLES,
    FILTER_CLIENTS,
    GET_CLIENTS_BASIC_INFORMATION,
    GET_CLIENTS_ADDITIONAL_INFORMATION,

    GET_TASKS,
    GET_ALL_TASKS,

    ACCESS_SUPPLIERS,
    ACCESS_STORE_GROUPS,
    ACCESS_PRICE_GROUPS,
    ACCESS_STORE_PRODUCTS,
    EDIT_STORE_PRODUCT_PRICE,
    ACCESS_INCOME_STORE_DOCS,
    ACCESS_EXPENSE_STORE_DOCS,
    SEARCH_STORE_PRODUCT,
    SEARCH_STORE_PRODUCT_WITH_PRICE,
    VIEW_STORE,
    VIEW_STORE_WITH_PRICE,

    ACCESS_ACCOUNTING,
    EDIT_CASH_ORDERS,

    ACCESS_KPI,
    ACCESS_FEEDBACK,
    ACCESS_CALL_STATISTICS,

    ACCESS_ORDER_DIAGNOSTICS,
    ACCESS_LABOR_CATALOGUE,
    ACCESS_DIAGNOSTIC_CATALOGUE,
    ACCESS_TECDOC_MODAL_WINDOW,
    ACCESS_SUPPLIER_MODAL_WINDOW,
    ACCESS_NORM_HOURS_MODAL_WINDOW,
    ACCESS_TECH_AUTO_DATA_MODAL_WINDOW,
    ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW,
    ACCESS_AGREEMENT,
    ACCESS_TELEGRAM,
    ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,

    DEMO,
});

export const DASHBOARD_PERMISSIONS = 'DASHBOARD_PERMISSIONS';
export const ORDERS_PERMISSIONS = 'ORDERS_PERMISSIONS';
export const CLIENTS_PERMISSIONS = 'CLIENTS_PERMISSIONS';
export const TASKS_PERMISSIONS = 'TASKS_PERMISSIONS';
export const EMPLOYEES_PERMISSIONS = 'EMPLOYEES_PERMISSIONS';
export const WAREHOUSE_PERMISSIONS = 'WAREHOUSE_PERMISSIONS';
export const ACCOUNTING_PERMISSIONS = 'ACCOUNTING_PERMISSIONS';
export const REPORTS_PERMISSIONS = 'REPORTS_PERMISSIONS';
export const OTHER_PERMISSIONS = 'OTHER_PERMISSIONS';
export const MOBI_PERMISSIONS = 'MOBI_PERMISSIONS';

// using for roles page
export const groupedPermissions = {
    [ DASHBOARD_PERMISSIONS ]: [
        ACCESS_DASHBOARD,
        EDIT_DASHBOARD_ORDER,
        OPEN_DASHBOARD_ORDER,
        CREATE_DASHBOARD_ORDER,
        RESCHEDULE_ORDERS,
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
        LIMITED_PRINT,
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
    [ TASKS_PERMISSIONS ]:     [ GET_TASKS, GET_ALL_TASKS ],
    [ EMPLOYEES_PERMISSIONS ]: [ GET_EMPLOYEES, CREATE_EDIT_DELETE_EMPLOYEES, EMPLOYEES_SALARIES ],
    [ WAREHOUSE_PERMISSIONS ]: [
        ACCESS_SUPPLIERS,
        ACCESS_STORE_GROUPS,
        ACCESS_PRICE_GROUPS,
        ACCESS_STORE_PRODUCTS,
        EDIT_STORE_PRODUCT_PRICE,
        ACCESS_INCOME_STORE_DOCS,
        ACCESS_EXPENSE_STORE_DOCS,
        SEARCH_STORE_PRODUCT,
        // SEARCH_STORE_PRODUCT_WITH_PRICE,
        VIEW_STORE, // tracking, movement, balance
        // VIEW_STORE_WITH_PRICE,
    ],
    [ ACCOUNTING_PERMISSIONS ]: [ ACCESS_ACCOUNTING, EDIT_CASH_ORDERS ],
    [ REPORTS_PERMISSIONS ]:    [ ACCESS_KPI, ACCESS_FEEDBACK, ACCESS_CALL_STATISTICS ],
    [ MOBI_PERMISSIONS ]: [
        ACCESS_ORDER_DIAGNOSTICS,
        ACCESS_LABOR_CATALOGUE,
        ACCESS_DIAGNOSTIC_CATALOGUE,
        ACCESS_TECDOC_MODAL_WINDOW,
        ACCESS_SUPPLIER_MODAL_WINDOW,
        ACCESS_NORM_HOURS_MODAL_WINDOW,
        ACCESS_TECH_AUTO_DATA_MODAL_WINDOW,
        ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW,
        ACCESS_AGREEMENT,
        ACCESS_TELEGRAM,
        ACCESS_ORDER_CHANGE_AGREEMENT_STATUS,
    ],
    [ OTHER_PERMISSIONS ]:      [ DEMO ],
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
    [ REPORTS_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.reports_permissions',
    }),
    [ MOBI_PERMISSIONS ]: intl.formatMessage({
        id: 'roles.mobi_permissions',
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
    [ LIMITED_PRINT ]:        intl.formatMessage({ id: 'roles.limited_print' }),
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
    [ RESCHEDULE_ORDERS ]: intl.formatMessage({
        id: 'roles.reschedule_orders',
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

    [ GET_TASKS ]: intl.formatMessage({
        id: 'roles.get_tasks',
    }),
    [ GET_ALL_TASKS ]: intl.formatMessage({
        id: 'roles.get_all_tasks',
    }),

    [ ACCESS_SUPPLIERS ]: intl.formatMessage({
        id: 'roles.access_suppliers',
    }),

    [ ACCESS_STORE_GROUPS ]: intl.formatMessage({
        id: 'roles.access_store_groups',
    }),

    [ ACCESS_PRICE_GROUPS ]: intl.formatMessage({
        id: 'roles.access_price_groups',
    }),

    [ ACCESS_STORE_PRODUCTS ]: intl.formatMessage({
        id: 'roles.access_store_products',
    }),

    [ EDIT_STORE_PRODUCT_PRICE ]: intl.formatMessage({
        id: 'roles.edit_store_product_price',
    }),

    [ ACCESS_INCOME_STORE_DOCS ]: intl.formatMessage({
        id: 'roles.access_income_store_docs',
    }),

    [ ACCESS_EXPENSE_STORE_DOCS ]: intl.formatMessage({
        id: 'roles.access_expense_store_docs',
    }),

    [ SEARCH_STORE_PRODUCT ]: intl.formatMessage({
        id: 'roles.search_store_product',
    }),

    [ SEARCH_STORE_PRODUCT_WITH_PRICE ]: intl.formatMessage({
        id: 'roles.search_store_product_with_price',
    }),

    [ VIEW_STORE ]: intl.formatMessage({
        id: 'roles.view_store',
    }),

    [ VIEW_STORE_WITH_PRICE ]: intl.formatMessage({
        id: 'roles.view_store_with_price',
    }),

    [ ACCESS_ACCOUNTING ]: intl.formatMessage({
        id: 'roles.access_accounting',
    }),
    [ EDIT_CASH_ORDERS ]: intl.formatMessage({
        id: 'roles.edit_cash_orders',
    }),

    [ ACCESS_KPI ]: intl.formatMessage({
        id: 'roles.access_kpi',
    }),
    [ ACCESS_FEEDBACK ]: intl.formatMessage({
        id: 'roles.access_feedback',
    }),
    [ ACCESS_CALL_STATISTICS ]: intl.formatMessage({
        id: 'roles.access_call_statistics',
    }),

    [ ACCESS_ORDER_DIAGNOSTICS ]: intl.formatMessage({
        id: 'roles.access_order_diagnostics',
    }),
    [ ACCESS_LABOR_CATALOGUE ]: intl.formatMessage({
        id: 'roles.access_labor_catalogue',
    }),
    [ ACCESS_DIAGNOSTIC_CATALOGUE ]: intl.formatMessage({
        id: 'roles.access_diagnostic_catalogue',
    }),
    [ ACCESS_TECDOC_MODAL_WINDOW ]: intl.formatMessage({
        id: 'roles.access_tecdoc_modal_window',
    }),
    [ ACCESS_SUPPLIER_MODAL_WINDOW ]: intl.formatMessage({
        id: 'roles.access_supplier_modal_window',
    }),
    [ ACCESS_NORM_HOURS_MODAL_WINDOW ]: intl.formatMessage({
        id: 'roles.access_norm_hours_modal_window',
    }),
    [ ACCESS_TECH_AUTO_DATA_MODAL_WINDOW ]: intl.formatMessage({
        id: 'roles.access_tech_auto_data_modal_window',
    }),
    [ ACCESS_ORDER_CREATIONG_OF_DIAGNOSTICS_MODAL_WINDOW ]: intl.formatMessage({
        id: 'roles.access_order_creationg_of_diagnostics_modal_window',
    }),
    [ ACCESS_AGREEMENT ]: intl.formatMessage({
        id: 'roles.access_agreement',
    }),
    [ ACCESS_TELEGRAM ]: intl.formatMessage({
        id: 'roles.access_telegram',
    }),
    [ ACCESS_ORDER_CHANGE_AGREEMENT_STATUS ]: intl.formatMessage({
        id: 'roles.access_order_change_agreement_status',
    }),

    [ DEMO ]: intl.formatMessage({
        id: 'roles.demo',
    }),
});
