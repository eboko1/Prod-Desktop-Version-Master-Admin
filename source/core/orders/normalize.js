// Core
import { schema, normalize } from 'normalizr';

// Денормализированные входные данные
const denormalized = [
    {
        activeTasks:            null,
        appurtenanciesTotalSum: 0,
        beginDatetime:          '2018-04-12T10:00:00.000Z',
        businessId:             1174,
        cancelReason:           null,
        cancelStatusOwnReason:  null,
        cancelStatusReason:     null,
        changeReason:           'cb24',
        clientId:               36638,
        clientName:             'Вова',
        clientPhone:            '+38(050) 420-16-61',
        clientPhones:           [ '+38(050) 420-16-61' ],
        clientSurname:          'Храпунов',
        datetime:               '2018-04-07T03:49:32.924Z',
        employeeJobtitle:       'электрик',
        employeeName:           'Игорь',
        employeeSurname:        'Иванов',
        id:                     118552,
        inviteExists:           118712,
        managerName:            null,
        managerSurname:         null,
        master:                 84,
        nps:                    null,
        num:                    'RD-1174-118552',
        odometer:               null,
        recommendation:         null,
        reviewIds:              null,
        serviceNames:           [ 'Розвал-сходження' ],
        services:               [ 558958 ],
        servicesTotalSum:       360,
        status:                 'approve',
        successDatetime:        null,
        vehicle:                'HYUNDAI i30 (2013)',
        vehicleId:              77348,
        vehicleInviteExists:    null,
        vehicleMakeId:          306,
        vehicleMakeName:        'HYUNDAI',
        vehicleModelId:         11364,
        vehicleModelName:       'i30',
        vehicleNumber:          null,
        vehicleVin:             null,
        vehicleYear:            2013,
        viewDatetime:           '2018-04-07T03:50:41.483Z',
    },
];

// Объявление схем
const client = new schema.Entity('client');

// -----
// business
// -----
// businessId
// employeeJobtitle
// employeeName
// employeeSurname
// managerName
// managerSurname
// master

// ----
// order
// ----
// id
// activeTasks
// cancelReason
// cancelStatusOwnReason
// cancelStatusReason
// changeReason
// inviteExists
// num
// status

// -----
// services
// ------
// serviceNames
// services
// servicesTotalSum

// ---
// review
// ---
// nps
// recommendation
// reviewIds

//----
// date
// -----
// beginDatetime
// datetime
// successDatetime
// viewDatetime

// -------
// client
// -------
// clientId
// clientName
// clientPhone
// clientPhones
// clientSurname

// -------
// vehicle
// ------
// odometer
// vehicle
// vehicleId
// vehicleMakeId
// vehicleMakeName
// vehicleModelId
// vehicleModelName
// vehicleNumber
// vehicleVin
// vehicleYear

// TODO:
// appurtenanciesTotalSum -> detailsTotalSum
// vehicleInviteExists -> ???

const result = new schema.Object({
    order,
    date,
    client,
    vehicle,
});
// Нормализированные выходные данные
const normalizedData = normalize(denormalized, result);

console.log('•λ•', normalizedData);
