// declare routes pathes

//__OLD_APP_URL__ will be replaced by webpack build
const OLD_APP_URL = __OLD_APP_URL__;

const book = Object.freeze({
    // Public
    login:               '/login',
    // Private
    profile:             '/profile',
    dashboard:           '/dashboard',
    myTasksPage:         '/mytasks',
    employeesPage:       '/employees',
    addEmployee:         '/employees/add',
    editEmployee:        '/employees/:id',
    packagePage:         '/packages',
    businessPackagePage: '/businesses/packages',
    managerRolePage:     '/managers/roles',
    rolePage:            '/packages/:id',

    // Orders
    orders:              '/orders',
    ordersByStatuses:    '/orders/:ordersStatuses',
    ordersAppointments:  '/orders/appointments',
    // Order
    order:               '/order',
    orderId:             '/order/:id',
    // AddOrder
    addOrder:            '/add',
    // reports
    reports:             '/orders/reports',
    // Exception
    exception:           '/exception',
    exceptionStatusCode: '/exception/:statusCode',

    oldApp: {
        // link to my.cb24.eu
        dashboard:              `${OLD_APP_URL}/dashboard`,
        tasks:                  `${OLD_APP_URL}/tasks`,
        clients:                `${OLD_APP_URL}/clients`,
        employees:              `${OLD_APP_URL}/employees`,
        controlPanel:           `${OLD_APP_URL}/control-panel`,
        indicators:             `${OLD_APP_URL}/universal-chart`,
        funel:                  `${OLD_APP_URL}/funel`,
        reviews:                `${OLD_APP_URL}/reviews`,
        statistics:             `${OLD_APP_URL}/statistics`,
        statisticsCalls:        `${OLD_APP_URL}/statistics/calls`,
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
