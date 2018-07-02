// declare routes pathes

const book = Object.freeze({
    // Public
    login:               '/login',
    home:                '/home',
    swapi:               '/swapi',
    // Private
    profile:             '/profile',
    distributorDash:     '/distributor-dash',
    request:             '/request',
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
});

export default book;
