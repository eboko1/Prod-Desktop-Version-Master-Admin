// proj
import book from 'routes/book';
import { permissions, isForbidden, isAdmin } from 'utils';

export default {
    sections: [
        /*  Operations submenu*/
        {
            key:      'operations',
            iconType: 'dashboard',
            name:     'navigation.operations',
            items:    [
                {
                    key:      '/dashboard',
                    link:     book.dashboard,
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_DASHBOARD),
                    name: 'navigation.planner',
                },
                {
                    key:      '/orders',
                    link:     book.ordersAppointments,
                    disabled: user =>
                        isForbidden(user, permissions.SHOW_ORDERS),
                    name: 'navigation.workflow',
                },
            ],
        },
        /* Reference Book submenu */
        {
            key:      'catalog',
            iconType: 'contacts',
            name:     'navigation.catalog',
            items:    [
                {
                    key:      '/clients',
                    link:     book.clients,
                    disabled: user =>
                        isForbidden(user, permissions.GET_CLIENTS),
                    name: 'navigation.clients',
                },
                {
                    key:      '/employees',
                    link:     book.employeesPage,
                    disabled: user =>
                        isForbidden(user, permissions.GET_EMPLOYEES),
                    name: 'navigation.employees',
                },
                {
                    key:      '/labors',
                    link:     book.laborsPage,
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_LABOR_CATALOGUE),
                    name: 'navigation.labors_page',
                },
            ],
        },
        /* Accounting */
        {
            key:      'accounting',
            iconType: 'audit',
            name:     'navigation.accounting',
            items:    [
                {
                    key:      '/cash/flow',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_ACCOUNTING),
                    link: book.cashFlowPage,
                    name: 'navigation.flow_of_money',
                },
            ],
        },
        /* Statistics and reports submenu*/
        {
            key:      'reports',
            iconType: 'line-chart',
            name:     'navigation.reports',
            items:    [
                {
                    key:      '/chart',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_KPI) &&
                        !isAdmin(user),
                    link: book.chart,
                    name: 'navigation.service_indicators',
                },
                {
                    key:      '/report/orders',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_REPORT_PROFIT_FROM_ORDERS) &&
                        !isAdmin(user),
                    link: book.reportOrders,
                    name: 'navigation.report_orders',
                },
            ],
        },
        /* Settings submenu */
        {
            key:      'settings',
            iconType: 'setting',
            name:     'navigation.settings',
            disabled: user => isForbidden(user, permissions.ACCESS_SETTINGS),
            items:    [
                {
                    key:      '/settings',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_SETTINGS_WEB),
                    link: book.oldApp.settings,
                    name: 'navigation.main_settings',
                },
                {
                    key:      '/cash/settings',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_CATALOGUE_CASH),
                    link: book.cashSettingsPage,
                    name: 'navigation.cash_settings',
                },
            ],
        },
        /* Administration submenu */
        {
            key:      'administration',
            iconType: 'database',
            disabled: user => isForbidden(user, permissions.ACCESS_ADMINISTRATION),
            name:     'navigation.administration',
            items:    [
                {
                    key:     '/managers/roles',
                    link:    book.managerRolePage,
                    visible: user => !isForbidden(user, permissions.GRANT),
                    name:    'navigation.manager_roles',
                },
            ],
        },
    ],

    getSelectedByRoute: function getSelectedByRoute(currentPath) {
        const result = {
            sectionKey: '',
            itemKey:    '',
        };
        //TODO
        for (let section of this.sections) {
            if (section.items) {
                for (let item of section.items) {
                    if (
                        currentPath.startsWith(item.key) &&
                        item.key.length > result.itemKey.length
                    ) {
                        Object.assign(result, {
                            sectionKey: section.key,
                            itemKey:    item.key,
                        });
                    }
                }
            } else {
                if (
                    currentPath.startsWith(section.key) &&
                    section.key.length > result.itemKey.length
                ) {
                    Object.assign(result, {
                        itemKey: section.key,
                    });
                }
            }
        }

        return result;
    },
};
