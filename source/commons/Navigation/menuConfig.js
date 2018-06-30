// proj
import book from 'routes/book';

//__OLD_UI_URL__ will be replaced by webpack build
const OLD_UI_URL = __OLD_UI_URL__; // eslint-disable-line no-undef

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
                    link: `${OLD_UI_URL}/dashboard`,
                    name: 'navigation.scheduler',
                },
                {
                    key:  '/orders',
                    link: book.ordersByStatuses,
                    name: 'navigation.appointments',
                },
                {
                    key:  '/tasks',
                    link: `${OLD_UI_URL}/tasks`,
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
                    link: `${OLD_UI_URL}/clients`,
                    name: 'navigation.clients',
                },
                {
                    key:  '/employees',
                    link: `${OLD_UI_URL}/employees`,
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
                    link: `${OLD_UI_URL}/control-panel`,
                    name: 'navigation.control_panel',
                },
                {
                    key:  '/indicators',
                    link: `${OLD_UI_URL}/universal-chart`,
                    name: 'navigation.service_indicators',
                },
                {
                    key:  '/funel',
                    link: `${OLD_UI_URL}/funel`,
                    name: 'navigation.funel',
                },
                {
                    key:  '/reviews',
                    link: `${OLD_UI_URL}/reviews`,
                    name: 'navigation.reviews',
                },
                {
                    key:  '/statistics',
                    link: `${OLD_UI_URL}/statistics`,
                    name: 'navigation.general_statistics',
                },
                {
                    key:  '/statistics/calls',
                    link: `${OLD_UI_URL}/statistics/calls`,
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
                    link: `${OLD_UI_URL}/settings`,
                    name: 'navigation.main',
                },
                {
                    key:  '/prices',
                    link: `${OLD_UI_URL}/settings/specialization`,
                    name: 'navigation.specialization_and_prices',
                },
                {
                    key:  '/services',
                    link: `${OLD_UI_URL}/settings/services`,
                    name: 'navigation.services',
                },
                {
                    key:  '/stocks',
                    link: `${OLD_UI_URL}/settings/offers`,
                    name: 'navigation.stocks',
                },
                {
                    key:  '/news',
                    link: `${OLD_UI_URL}/settings/news`,
                    name: 'navigation.news',
                },
                {
                    key:  '/articles',
                    link: `${OLD_UI_URL}/settings/articles`,
                    name: 'navigation.articles',
                },
                {
                    key:  '/media',
                    link: `${OLD_UI_URL}/settings/gallery`,
                    name: 'navigation.media_files',
                },
                {
                    key:  '/managers',
                    link: `${OLD_UI_URL}/settings/managers`,
                    name: 'navigation.system_managers',
                },
                {
                    key:  '/notice',
                    link: `${OLD_UI_URL}/settings/notifications`,
                    name: 'navigation.notice',
                },
            ],
        },
        {
            key:      '/suggest-idea',
            iconType: 'bulb',
            link:     `${OLD_UI_URL}/feedback`,
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
