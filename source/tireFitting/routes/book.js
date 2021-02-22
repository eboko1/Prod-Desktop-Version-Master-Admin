// declare routes pathes

//__OLD_APP_URL__ will be replaced by webpack build
const OLD_APP_URL = __OLD_APP_URL__;

const tireFittingBook = Object.freeze({
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
});

export default tireFittingBook;
