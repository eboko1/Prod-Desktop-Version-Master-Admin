// proj
import book from 'routes/book';

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
                    link: book.ordersByStatuses,
                    name: 'navigation.scheduler',
                },
                {
                    key:  '/orders',
                    link: book.ordersByStatuses,
                    name: 'navigation.appointments',
                },
                {
                    key:  '/tasks',
                    link: book.ordersByStatuses,
                    name: 'navigation.tasks',
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
                    link: book.ordersByStatuses,
                    name: 'navigation.clients',
                },
                {
                    key:  '/employees',
                    link: book.ordersByStatuses,
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
                    link: book.ordersByStatuses,
                    name: 'navigation.control_panel',
                },
                {
                    key:  '/indicators',
                    link: book.ordersByStatuses,
                    name: 'navigation.service_indicators',
                },
                {
                    key:  '/funel',
                    link: book.ordersByStatuses,
                    name: 'navigation.funel',
                },
                {
                    key:  '/statistics',
                    link: book.ordersByStatuses,
                    name: 'navigation.general_statistics',
                },
                {
                    key:  '/statistics/calls',
                    link: book.ordersByStatuses,
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
                    link: book.ordersByStatuses,
                    name: 'navigation.main',
                },
                {
                    key:  '/prices',
                    link: book.ordersByStatuses,
                    name: 'navigation.specialization_and_prices',
                },
                {
                    key:  '/services',
                    link: book.ordersByStatuses,
                    name: 'navigation.services',
                },
                {
                    key:  '/stocks',
                    link: book.ordersByStatuses,
                    name: 'navigation.stocks',
                },
                {
                    key:  '/news',
                    link: book.ordersByStatuses,
                    name: 'navigation.news',
                },
                {
                    key:  '/articles',
                    link: book.ordersByStatuses,
                    name: 'navigation.articles',
                },
                {
                    key:  '/media',
                    link: book.ordersByStatuses,
                    name: 'navigation.media_files',
                },
                {
                    key:  '/managers',
                    link: book.ordersByStatuses,
                    name: 'navigation.system_managers',
                },
                {
                    key:  '/notice',
                    link: book.ordersByStatuses,
                    name: 'navigation.notice',
                },
            ],
        },
        {
            key:      '/suggest-idea',
            iconType: 'bulb',
            link:     book.ordersByStatuses,
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
                    if (currentPath.startsWith(item.key)
                        && item.key.length > result.itemKey.length) {
                        Object.assign(result, {
                            sectionKey: section.key,
                            itemKey:    item.key,
                        });
                    }
                }  
            } else {
                if (currentPath.startsWith(section.key)
                    && section.key.length > result.itemKey.length) {
                    Object.assign(result, {
                        itemKey: section.key,
                    });
                }
            }
            
        }

        return result;
    },

};
