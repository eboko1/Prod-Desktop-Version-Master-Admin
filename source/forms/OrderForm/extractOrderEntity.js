// vendor
import _ from 'lodash';
import moment from 'moment';

// proj
import { permissions, isForbidden } from 'utils';

export function convertFieldsValuesToDbEntity(
    orderFields,
    allServices,
    allDetails,
    status = 'not_complete',
    user,
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
        })
        .value();

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
                purchasePrice: purchasePrice,
            } = detail;

            const detailConfig = allDetails.details.find(
                ({ detailId: id }) => String(id) === detailId,
            );
            const brandConfig = allDetails.brands.find(
                ({ brandId: id }) => String(id) === brandId,
            );

            const baseDetail = { price, count, code, purchasePrice };
            const detailCustom = !detailConfig
                ? { name: detailId }
                : { detailId };
            const brandCustom = !brandConfig
                ? { brandName: brandId }
                : { brandId };

            return { ...baseDetail, ...detailCustom, ...brandCustom };
        })
        .value();

    const beginDate = _.get(orderFields, 'beginDate');
    const beginTime = _.get(orderFields, 'beginTime');

    const deliveryDate = _.get(orderFields, 'deliveryDate');
    const deliveryTime = _.get(orderFields, 'deliveryTime');

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

    const deliveryDayPart =
        deliveryDate &&
        moment(deliveryDate)
            .utc()
            .format('YYYY-MM-DD');

    const deliveryHourPart =
        deliveryTime &&
        moment(deliveryTime)
            .utc()
            .format('HH:mm');

    const beginDatetime =
        dayPart &&
        hourPart &&
        moment(`${dayPart}T${hourPart}:00.000Z`).toISOString();

    const deliveryDatetime =
        deliveryDayPart &&
        deliveryHourPart &&
        moment(`${deliveryDayPart}T${deliveryHourPart}:00.000Z`).toISOString();

    const orderDuration = _.get(orderFields, 'duration');

    const order = {
        clientId:                    _.get(orderFields, 'selectedClient.clientId'),
        clientVehicleId:             _.get(orderFields, 'clientVehicle'),
        businessRequisiteId:         _.get(orderFields, 'requisite'),
        managerId:                   _.get(orderFields, 'manager'),
        duration:                    orderDuration ? Math.max(orderDuration, 0.5) : orderDuration,
        clientPhone:                 _.get(orderFields, 'clientPhone'),
        paymentMethod:               _.get(orderFields, 'paymentMethod'),
        clientRequisiteId:           _.get(orderFields, 'clientRequisite'),
        status,
        beginDatetime,
        deliveryDatetime,
        services,
        details,
        appurtenanciesResponsibleId: _.get(
            orderFields,
            'appurtenanciesResponsible',
        ),
        employeeId:       _.get(orderFields, 'employee'),
        stationNum:       _.get(orderFields, 'station'),
        detailsDiscount:  _.get(orderFields, 'detailsDiscount'),
        servicesDiscount: _.get(orderFields, 'servicesDiscount'),
        odometerValue:    _.get(orderFields, 'odometerValue'),
        recommendation:   _.get(orderFields, 'recommendation'),
        vehicleCondition: _.get(orderFields, 'vehicleCondition'),
        businessComment:  _.get(orderFields, 'businessComment'),
        comment:          _.get(orderFields, 'comment'),
    };

    const orderClearedFields = _.mapValues(
        order,
        value => value === '' ? null : value,
    );

    const rolesOmitFieldsFunctions = [
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_COMMENTS)
                ? _.omit(orderEntity, [ 'recommendation', 'vehicleCondition', 'businessComment', 'comment' ])
                : orderEntity,
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_STATUS)
                ? _.omit(orderEntity, [ 'status' ])
                : orderEntity,
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_SERVICES)
                ? _.omit(orderEntity, [ 'services', 'servicesDiscount' ])
                : orderEntity,
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_DETAILS)
                ? _.omit(orderEntity, [ 'details', 'detailsDiscount' ])
                : orderEntity,
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_BODY)
                ? _.pick(orderEntity, [ 'recommendation', 'vehicleCondition', 'businessComment', 'comment', 'status', 'services', 'servicesDiscount', 'details', 'detailsDiscount' ])
                : orderEntity,
    ];

    return rolesOmitFieldsFunctions.reduce(
        (prev, current) => current(prev),
        orderClearedFields,
    );
}

export const requiredFieldsOnStatuses = values => {
    /* eslint-disable camelcase */
    const statuses = {
        invite: [ 'clientVehicle', 'manager', 'clientPhone' ],
        call:   [ 'clientPhone', 'manager' ],

        not_complete: [ 'manager' ],
        required:     [ 'manager' ],

        reserve: [ 'beginDate', 'beginTime', 'manager', 'station', 'deliveryDate', 'deliveryTime' ],
        approve: [ 'beginDate', 'beginTime', 'manager', 'clientPhone', 'station', 'deliveryDate', 'deliveryTime' ],

        redundant: [],
        cancel:    [],

        progress: [ 'beginDate', 'beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station', 'deliveryDatetime' ],

        success: [ 'beginDate', 'beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station', 'deliveryDatetime' ],
    };

    if (values.beginDate || values.beginTime) {
        return _.mapValues(statuses, fields =>
            _.uniq([ ...fields, 'beginDate', 'beginTime' ]));
    }

    return statuses;
};
