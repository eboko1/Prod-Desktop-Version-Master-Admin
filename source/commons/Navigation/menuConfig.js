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
        /* Catalog submenu */
        {
            key:      'catalog',
            iconType: 'contacts',
            name:     'navigation.catalog',
            items:    [
                {
                    key:  '/clients',
                    link: book.clients,
                    name: 'navigation.clients',
                },
                {
                    key:  '/employees',
                    link: book.employeesPage,
                    name: 'navigation.employees',
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
                    key:  '/control-panel',
                    link: book.oldApp.controlPanel,
                    name: 'navigation.control_panel',
                },
                {
                    key:  '/indicators',
                    link: book.oldApp.indicators,
                    name: 'navigation.service_indicators',
                },
                {
                    key:  '/funel',
                    link: book.oldApp.funel,
                    name: 'navigation.funnel',
                },
                {
                    key:  '/reviews',
                    link: book.oldApp.reviews,
                    name: 'navigation.feedback',
                },
                {
                    key:  '/statistics',
                    link: book.oldApp.statistics,
                    name: 'navigation.statistics',
                },
                {
                    key:  '/statistics/calls',
                    link: book.oldApp.statisticsCalls,
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
                    key:  '/settings',
                    link: book.oldApp.settings,
                    name: 'navigation.main_settings',
                },
                {
                    key:  '/requisites',
                    link: book.oldApp.settingsRequisites,
                    name: 'navigation.requisites',
                },
                {
                    key:  '/prices',
                    link: book.oldApp.settingsSpecialization,
                    name: 'navigation.specialization_and_prices',
                },
                {
                    key:  '/services',
                    link: book.oldApp.settingsServices,
                    name: 'navigation.services',
                },
                {
                    key:  '/stocks',
                    link: book.oldApp.settingsOffers,
                    name: 'navigation.special_offers',
                },
                {
                    key:  '/news',
                    link: book.oldApp.settingsNews,
                    name: 'navigation.news',
                },
                {
                    key:  '/articles',
                    link: book.oldApp.settingsArticles,
                    name: 'navigation.articles',
                },
                {
                    key:  '/media',
                    link: book.oldApp.settingsGallery,
                    name: 'navigation.media_files',
                },
                {
                    key:  '/managers',
                    link: book.oldApp.settingsManagers,
                    name: 'navigation.managers',
                },
                {
                    key:  '/notice',
                    link: book.oldApp.settingsNotifications,
                    name: 'navigation.notifications',
                },
            ],
        },
        /* Roles submenu */
        {
            key:      'roles',
            iconType: 'book',
            disabled: user => isForbidden(user, permissions.GRANT),
            name:     'navigation.roles',
            items:    [
                {
                    key:     '/packages',
                    link:    book.packagePage,
                    visible: user => isAdmin(user),
                    name:    'navigation.package',
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
            ],
        },
        {
            key:      '/suggest-idea',
            iconType: 'bulb',
            link:     book.oldApp.feedback,
            name:     'navigation.suggest_idea',
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
