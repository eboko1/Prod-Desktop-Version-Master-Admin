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
                    key:      '/new-document',
                    link:     book.newDocumentPage,
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_DASHBOARD),
                    name: 'navigation.new_document',
                },
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
                    key:      '/locations',
                    link:      book.locationsPage,
                    name:      'navigation.locations',
                },
                {
                    key:      '/mytasks',
                    link:     book.myTasksPage,
                    disabled: user => isForbidden(user, permissions.GET_TASKS),
                    name:     'navigation.mytasks',
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
                    key:      '/warehouses',
                    link:     book.warehouses,
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    name: 'navigation.warehouses',
                },
                {
                    key:      '/suppliers',
                    link:     book.suppliersPage,
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_SUPPLIERS),
                    name: 'navigation.suppliers',
                },
                {
                    key:      '/products-groups',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_STORE_GROUPS),
                    link: book.productsGroups,
                    name: 'navigation.products_groups',
                },
                {
                    key:      '/price-groups',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_PRICE_GROUPS),
                    link: book.priceGroups,
                    name: 'navigation.price_groups',
                },
                {
                    key:      '/products',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_STORE_PRODUCTS),
                    link: book.products,
                    name: 'navigation.products',
                },
                {
                    key:      '/labors',
                    link:     book.laborsPage,
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_LABOR_CATALOGUE),
                    name: 'navigation.labors_page',
                },
                {
                    key:      '/diagnostic-patterns',
                    disabled: user =>
                        isForbidden(
                            user,
                            permissions.ACCESS_DIAGNOSTIC_CATALOGUE,
                        ),
                    link: book.diagnosticPatterns,
                    name: 'navigation.diagnostic_patterns',
                },
                {
                    key:      '/repair-map',
                    link: book.repairMapSetting,
                    name: 'navigation.repair_map',
                },
                {
                    key:      '/location-settings',
                    link: book.locationSettings,
                    name: 'navigation.locations_settings',
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
                {
                    key:      '/cash/clients-debts',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_ACCOUNTING),
                    link: book.cashClientsDebtsPage,
                    name: 'navigation.clients_debts',
                },
                {
                    key:      '/cash/bank',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_ACCOUNTING),
                    link: book.cashBankPage,
                    name: 'navigation.cash_bank',
                },
            ],
        },
        /* Storage */
        {
            key:      'storage',
            iconType: 'inbox',
            name:     'navigation.storage',
            items:    [
                {
                    key:      '/storage-balance',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageBalance,
                    name: 'navigation.storage_balance',
                },
                {
                    key:      '/storage-orders',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageOrders,
                    name: 'navigation.orders',
                },
                {
                    key:      '/storage-incomes',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageIncomes,
                    name: 'navigation.incomes',
                },
                {
                    key:      '/storage-expenses',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageExpenses,
                    name: 'navigation.expenses',
                },
                {
                    key:      '/storage-transfers',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageTransfers,
                    name: 'navigation.transfers',
                },
                {
                    key:      '/storage-movement',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE),
                    link: book.storageMovement,
                    name: 'navigation.storage_movement',
                },
                {
                    key:      '/storage-inventory',
                    disabled: user =>
                        isForbidden(user, permissions.VIEW_STORE) || true,
                    link: book.storageInventory,
                    name: 'navigation.inventory',
                },
            ],
        },
        /* Locations 
        {
            key:      'locations',
            iconType: 'heat-map',
            name:     'navigation.locations',
            items:    [
                {
                    key:      '/location-document',
                    link: book.locationsDocument,
                    name: 'navigation.locations_document',
                },
                {
                    key:      '/location-vehicles',
                    link: book.locationsVehicles,
                    name: 'navigation.locations_vehicles',
                },
                {
                    key:      '/location-movement',
                    link: book.locationsMovement,
                    name: 'navigation.locations_movement',
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
                    key:      '/feedback',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_FEEDBACK) &&
                        !isAdmin(user),
                    link: book.feedback,
                    name: 'navigation.feedback',
                },
                {
                    key:      '/calls',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_CALL_STATISTICS) &&
                        !isAdmin(user),
                    link: book.calls,
                    name: 'navigation.call_statistics',
                },
                {
                    key:      '/report/orders',
                    disabled: user =>
                        isForbidden(user, permissions.SHOW_ORDERS) &&
                        !isAdmin(user),
                    link: book.reportOrders,
                    name: 'navigation.report_orders',
                },
                {
                    key:      '/report/load_kpi',
                    disabled: user =>
                        isForbidden(user, permissions.SHOW_ORDERS) &&
                        !isAdmin(user),
                    link: book.reportLoadKPI,
                    name: 'navigation.report_load_kpi',
                },
            ],
        },
        /* Payment submenu */
        {
            key:      'payment',
            iconType: 'wallet',
            name:     'navigation.payment',
            items:    [
                // {
                //     key:  '/payment',
                //     //disabled: user => !isForbidden(user, permissions.DEMO),
                //     link: book.paymentPage,
                //     name: 'navigation.payment',
                // },
                {
                    key:  '/subscription/history',
                    //disabled: user => !isForbidden(user, permissions.DEMO),
                    link: book.subscriptionHistoryPage,
                    name: 'navigation.subscription_history',
                },
                {
                    key:  '/subscription/packages',
                    //disabled: user => !isForbidden(user, permissions.DEMO),
                    link: book.subscriptionPackagesPage,
                    name: 'navigation.subscription_packages',
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
                    key:      '/cash/settings',
                    disabled: user =>
                        isForbidden(user, permissions.ACCESS_ACCOUNTING),
                    link: book.cashSettingsPage,
                    name: 'navigation.cash_settings',
                },
                {
                    key:      '/storage',
                    disabled: user =>
                        !isForbidden(user, permissions.VIEW_STORE) &&
                            !isAdmin(user) ||
                        true,
                    link: book.storage,
                    name: 'navigation.storage',
                },
                {
                    key:      '/requisites',
                    disabled: user =>
                        !isForbidden(user, permissions.DEMO) && !isAdmin(user),
                    link: book.requisites,
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
                {
                    key:     '/administration/availabilities',
                    link:    book.availabilitiesPage,
                    visible: user => isAdmin(user),
                    name:    'navigation.availabilities',
                },
                {
                    key:     '/administration/sync-import',
                    link:    book.syncImportPage,
                    visible: user => isAdmin(user),
                    name:    'navigation.sync_import',
                },
                {
                    key:     '/administration/sync-export',
                    link:    book.syncExportPage,
                    visible: user => isAdmin(user),
                    name:    'navigation.sync_export',
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
