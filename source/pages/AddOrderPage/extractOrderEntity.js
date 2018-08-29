import _ from 'lodash';
import moment from 'moment';

export function convertFieldsValuesToDbEntity(
    orderFields,
    allServices,
    allDetails,
    status = 'not_complete',
) {
    const services = _(orderFields.services)
        .filter(Boolean)
        .filter(service => _.get(service, 'serviceName'))
        .map(service => {
            const {
                serviceName: name,
                servicePrice: price,
                serviceCount: count,
                employeeId: employeeId,
                ownDetail: ownDetail,
            } = service;
            const hours = null;

            const serviceConfig = allServices.find(
                ({ id, type }) => `${type}|${id}` === name,
            );

            const baseService = { price, count, hours, employeeId, ownDetail };
            const serviceType = !serviceConfig
                ? { type: 'custom', serviceName: name }
                : { type: name.split('|')[ 0 ], serviceId: name.split('|')[ 1 ] };

            return { ...baseService, ...serviceType };
        }).value();

    const details = _(orderFields.details)
        .filter(Boolean)
        .filter(detail => _.get(detail, 'detailName'))
        .map(detail => {
            const {
                detailName: detailId,
                detailPrice: price,
                detailCount: count,
                detailCode: code,
                detailBrandName: brandId,
            } = detail;

            const detailConfig = allDetails.details.find(
                ({ detailId: id }) => id === detailId,
            );
            const brandConfig = allDetails.brands.find(
                ({ brandId: id }) => String(id) === brandId,
            );

            const baseDetail = { price, count, code };
            const detailCustom = !detailConfig
                ? { name: detailId }
                : { detailId };
            const brandCustom = !brandConfig
                ? { brandName: brandId }
                : { brandId };

            return { ...baseDetail, ...detailCustom, ...brandCustom };
        }).value();

    const beginDate = _.get(orderFields, 'beginDate');
    const beginTime = _.get(orderFields, 'beginTime');

    const dayPart =
        beginDate &&
        moment(beginDate)
            .utc()
            .format('YYYY-MM-DD');
    const hourPart =
        beginTime &&
        moment(beginTime)
            .utc()
            .format('HH:mm');

    const beginDatetime =
        dayPart &&
        hourPart &&
        moment(`${dayPart}T${hourPart}:00.000Z`).toISOString();

    const orderDuration = _.get(orderFields, 'duration');

    const order = {
        clientId:            _.get(orderFields, 'selectedClient.clientId'),
        clientVehicleId:     _.get(orderFields, 'clientVehicle'),
        businessRequisiteId: _.get(orderFields, 'requisite'),
        managerId:           _.get(orderFields, 'manager'),
        duration:            orderDuration ? Math.max(orderDuration, 0.5) : orderDuration,
        clientPhone:         _.get(orderFields, 'clientPhone'),
        paymentMethod:       _.get(orderFields, 'paymentMethod'),
        clientRequisiteId:   _.get(orderFields, 'clientRequisite'),
        status,
        beginDatetime,
        services,
        details,
        employeeId:          _.get(orderFields, 'employee'),
        stationNum:          _.get(orderFields, 'station'),
        detailsDiscount:     _.get(orderFields, 'detailsDiscount'),
        servicesDiscount:    _.get(orderFields, 'servicesDiscount'),
        odometerValue:       _.get(orderFields, 'odometerValue'),
        recommendation:      _.get(orderFields, 'recommendation'),
        vehicleCondition:    _.get(orderFields, 'vehicleCondition'),
        businessComment:     _.get(orderFields, 'businessComment'),
        comment:             _.get(orderFields, 'comment'),
    };

    return _.mapValues(order, value => value === '' ? null : value);
}

export const requiredFieldsOnStatuses = {
    invite: [ 'clientVehicle', 'manager', 'clientPhone' ],
    call:   [ 'clientPhone', 'manager' ],

    not_complete: [ 'manager' ],
    required:     [ 'manager' ],

    reserve: [ 'beginDate', 'beginTime', 'manager' ],
    approve: [ 'beginDate', 'beginTime', 'manager', 'clientPhone' ],

    redundant: [],
    cancel:    [],

    progress: [ 'beginDate', 'beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station' ],

    success: [ 'beginDate', 'beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station' ],
};
