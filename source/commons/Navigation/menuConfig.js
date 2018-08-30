import _ from 'lodash';

// proj
import book from 'routes/book';
import { permissions } from 'utils';

export default {
    sections: [
        /*  Operations submenu*/
        {
            key:      'operations',
            iconType: 'dashboard',
            name:     'navigation.operations',
            items:    [
                {
                    key:  '/dashboard',
                    link: book.dashboard,
                    name: 'navigation.scheduler',
                },
                {
                    key:      '/orders',
                    link:     book.ordersAppointments,
                    disabled: ({ isAdmin, scope }) =>
                        !isAdmin &&
                        !(
                            _.isArray(scope) &&
                            scope.includes(permissions.SHOW_ORDERS)
                        ),
                    name: 'navigation.appointments',
                },
                {
                    key:  '/tasks',
                    link: book.oldApp.tasks,
                    name: 'navigation.tasks',
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
                    link: book.oldApp.clients,
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
                    name: 'navigation.funel',
                },
                {
                    key:  '/reviews',
                    link: book.oldApp.reviews,
                    name: 'navigation.reviews',
                },
                {
                    key:  '/statistics',
                    link: book.oldApp.statistics,
                    name: 'navigation.general_statistics',
                },
                {
                    key:  '/statistics/calls',
                    link: book.oldApp.statisticsCalls,
                    name: 'navigation.calls_statistics',
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
                    name: 'navigation.main',
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
                    name: 'navigation.stocks',
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
                    name: 'navigation.system_managers',
                },
                {
                    key:  '/notice',
                    link: book.oldApp.settingsNotifications,
                    name: 'navigation.notice',
                },
            ],
        },
        /* Roles submenu */
        {
            key:      'roles',
            iconType: 'book',
            name:     'navigation.roles',
            items:    [
                {
                    key:  '/packages',
                    link: book.packagePage,
                    name: 'navigation.package',
                },
                {
                    key:  '/businesses/packages',
                    link: book.businessPackagePage,
                    name: 'navigation.business_package',
                },
                {
                    key:  '/managers/roles',
                    link: book.managerRolePage,
                    name: 'navigation.manager_role',
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
