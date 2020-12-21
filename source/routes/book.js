// declare routes pathes

//__OLD_APP_URL__ will be replaced by webpack build
const OLD_APP_URL = __OLD_APP_URL__;

const book = Object.freeze({
    // Public
    login:                    '/login',
    forgotPassword:           '/forgot-password',
    // newPasswordPage:     '/new-password',
    newPassword:              '/new-password',
    exception:                '/exception',
    exceptionStatusCode:      '/exception/:statusCode',
    // Private
    userAgreement:            '/user-agreement',
    profile:                  '/profile',
    dashboard:                '/dashboard',
    myTasksPage:              '/mytasks',
    newDocumentPage:          '/new-document',
    //
    // Orders
    //
    orders:                   '/orders',
    ordersByStatuses:         '/orders/:ordersStatuses',
    ordersAppointments:       '/orders/appointments',
    agreement:                '/agreement',
    // Order
    order:                    '/order',
    orderId:                  '/order/:id',
    // AddOrder
    addOrder:                 '/add',
    // reports
    reports:                  '/orders/reports',
    reportOrders:             '/report/orders',
    reportLoadKPI:      '/report/kpi_for_loading',
    //
    // Reference book
    //
    // Clients
    clients:                  '/clients',
    client:                   '/client',
    clientId:                 '/client/:id',
    // Employees
    employeesPage:            '/employees',
    addEmployee:              '/employees/add',
    // TODO: employeeId
    editEmployee:             '/employees/:id',
    // Suppliers
    suppliersPage:            '/suppliers',
    supplierPage:             '/supplier/:id',
    supplier:                 '/supplier',
    //
    // Catalogue
    //
    laborsPage:               '/labors',
    diagnosticPatterns:       '/diagnostic-patterns',
    warehouses:               '/warehouses',
    //
    //  Cash
    //
    cashFlowPage:             '/cash/flow',
    cashClientsDebtsPage:     '/cash/clients-debts',
    cashSettingsPage:         '/cash/settings',
    cashBankPage:             '/cash/bank',
    //
    // Storage
    //
    productsGroups:           '/products-groups',
    priceGroups:              '/price-groups',
    products:                 '/products',
    storageOrders:            '/storage-orders',
    storageIncomes:           '/storage-incomes',
    storageExpenses:          '/storage-expenses',
    storageTransfers:         '/storage-transfers',
    storageBalance:           '/storage-balance',
    storageMovement:          '/storage-movement',
    storageInventory:         '/storage-inventory',
    storageDocument:          '/document-storage',
    storageDocumentId:        '/document-storage/:id',
    productsTracking:         '/tracking',
    storageIncomeDoc:         '/income-document',
    storageIncomeDocId:       '/income-document/:id',
    repairMapSetting:         '/repair-map',
    //
    // Locations
    //
    locationsPage:            '/locations',
    locationSettings:         '/location-settings',
    locationsDocument:        '/location-document',
    locationsVehicles:        '/location-vehicles',
    locationsMovement:        '/location-movement',
    //
    // Statistics
    //
    chart:                    '/chart',
    feedback:                 '/feedback',
    feedbackId:               '/feedback/:id',
    calls:                    '/calls',
    //
    // Payment
    //
    paymentPage:              '/payment',
    subscriptionPackagesPage: '/subscription/packages',
    subscriptionHistoryPage:  '/subscription/history',
    //
    // Settings
    //
    storage:                  '/storage',
    packagePage:              '/packages',
    businessPackagePage:      '/businesses/packages',
    managerRolePage:          '/managers/roles',
    rolePage:                 '/roles',
    requisites:               '/requisites',
    //
    // Administration
    //
    servicesPage:             '/administration/services',
    brandsPage:               '/administration/brands',
    availabilitiesPage:       '/administration/availabilities',

    oldApp: {
        // link to my.cb24.eu
        // dashboard:              `${OLD_APP_URL}/dashboard`,
        tasks:                  `${OLD_APP_URL}/tasks`,
        // clients:                `${OLD_APP_URL}/clients`,
        // employees:              `${OLD_APP_URL}/employees`,
        controlPanel:           `${OLD_APP_URL}/control-panel`,
        // indicators:             `${OLD_APP_URL}/universal-chart`,
        funel:                  `${OLD_APP_URL}/funel`,
        // reviews:                `${OLD_APP_URL}/reviews`,
        statistics:             `${OLD_APP_URL}/statistics`,
        // statisticsCalls:        `${OLD_APP_URL}/statistics/calls`,
        settings:               `${OLD_APP_URL}/settings`,
        settingsRequisites:     `${OLD_APP_URL}/requisites`,
        settingsSpecialization: `${OLD_APP_URL}/settings/specialization`,
        settingsServices:       `${OLD_APP_URL}/settings/services`,
        settingsOffers:         `${OLD_APP_URL}/settings/offers`,
        settingsNews:           `${OLD_APP_URL}/settings/news`,
        settingsArticles:       `${OLD_APP_URL}/settings/articles`,
        settingsGallery:        `${OLD_APP_URL}/settings/gallery`,
        settingsManagers:       `${OLD_APP_URL}/settings/managers`,
        settingsNotifications:  `${OLD_APP_URL}/settings/notifications`,
        feedback:               `${OLD_APP_URL}/feedback`,
    },
});

export default book;
