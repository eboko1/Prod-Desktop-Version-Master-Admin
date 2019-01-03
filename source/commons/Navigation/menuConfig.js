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
                {
                    key:  '/mytasks',
                    link: book.myTasksPage,
                    name: 'navigation.mytasks',
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
                    key:      '/suppliers',
                    link:     book.suppliersPage,
                    // disabled: user => isForbidden(user, permissions.SUPPLIERS),
                    name:     'navigation.suppliers',
                },
            ],
        },
        {
            key:      'cash',
            iconType: 'wallet',
            name:     'navigation.cash',
            items:    [
                {
                    key:      '/cash/settings',
                    // disabled: user =>
                    //     isForbidden(user, permissions.CASH_SETTINGS),
                    link: book.cashSettingsPage,
                    name: 'navigation.cash_settings',
                },
                {
                    key:      '/cash/orders',
                    // disabled: user =>
                    //     isForbidden(user, permissions.CASH_ORDERS),
                    link: book.cashOrdersPage,
                    name: 'navigation.cash_orders',
                },
                {
                    key:      '/cash/accounting',
                    // disabled: user =>
                    //     isForbidden(user, permissions.CASH_ACCOUNTING),
                    link: book.cashAccountingPage,
                    name: 'navigation.cash_accounting',
                },
            ],
        },
        /* Statistics submenu */
        {
            key:      'reports',
            iconType: 'line-chart',
            name:     'navigation.reports',
            items:    [
                {
                    key:      '/chart',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.chart,
                    name: 'navigation.service_indicators',
                },
                {
                    key:      '/feedback',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.feedback,
                    name: 'navigation.feedback',
                },
                {
                    key:      '/calls',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.calls,
                    name: 'navigation.call_statistics',
                },
            ],
        },
        /* Settings submenu */
        {
            key:      'settings',
            iconType: 'setting',
            name:     'navigation.settings',
            items:    [
                {
                    key:      '/settings',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settings,
                    name: 'navigation.main_settings',
                },
                {
                    key:      '/requisites',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsRequisites,
                    name: 'navigation.requisites',
                },
                {
                    key:      '/prices',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsSpecialization,
                    name: 'navigation.specialization_and_prices',
                },
                {
                    key:      '/services',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsServices,
                    name: 'navigation.services',
                },
                {
                    key:      '/stocks',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsOffers,
                    name: 'navigation.special_offers',
                },
                {
                    key:      '/news',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsNews,
                    name: 'navigation.news',
                },
                {
                    key:      '/articles',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsArticles,
                    name: 'navigation.articles',
                },
                {
                    key:      '/media',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsGallery,
                    name: 'navigation.media_files',
                },
                {
                    key:      '/managers',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsManagers,
                    name: 'navigation.managers',
                },
                {
                    key:      '/notice',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.oldApp.settingsNotifications,
                    name: 'navigation.notifications',
                },
            ],
        },
        /* Administration submenu */
        {
            key:      'administration',
            iconType: 'database',
            disabled: user => isForbidden(user, permissions.GRANT),
            name:     'navigation.administration',
            items:    [
                {
                    key:     '/packages',
                    link:    book.packagePage,
                    visible: user => isAdmin(user),
                    name:    'navigation.package',
                },
                {
                    key:     '/roles',
                    link:    book.rolePage,
                    visible: user => isAdmin(user),
                    name:    'navigation.roles',
                },
                {
                    key:     '/businesses/packages',
                    link:    book.businessPackagePage,
                    visible: user => isAdmin(user),
                    name:    'navigation.business_packages',
                },
                {
                    key:     '/managers/roles',
                    link:    book.managerRolePage,
                    visible: user => !isForbidden(user, permissions.GRANT),
                    name:    'navigation.manager_roles',
                },
                {
                    key:     '/administration/services',
                    link:    book.servicesPage,
                    visible: user => isAdmin(user),
                    name:    'navigation.services-spare_parts',
                },
                {
                    key:     '/administration/brands',
                    link:    book.brandsPage,
                    visible: user => isAdmin(user),
                    name:    'navigation.priority_brands',
                },
            ],
        },
        {
            key:      '/suggest-idea',
            iconType: 'bulb',
            disabled: user =>
                !isForbidden(user, permissions.DEMO) && !isAdmin(user),
            link: book.oldApp.feedback,
            name: 'navigation.suggest_idea',
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
