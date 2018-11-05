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

    const beginDate = _.get(orderFields, 'stationLoads[0].beginDate');
    const beginTime = _.get(orderFields, 'stationLoads[0].beginTime');

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

    const deliveryDatetime = deliveryDayPart && deliveryHourPart
        ? moment(`${deliveryDayPart}T${deliveryHourPart}:00.000Z`).toISOString() // eslint-disable-next-line no-extra-parens
        : (status === 'success' ? moment(new Date()).toISOString() : null);

    const orderDuration = _.get(orderFields, 'stationLoads[0].duration');

    const stationLoadsEntity = _.get(orderFields, 'stationLoads')
        .filter(
            ({ beginDate, beginTime, station }) =>
                ![ beginDate, beginTime, station ].some(_.isNil),
        )
        .map(obj => {
            const dayPart =
                obj.beginDate &&
                moment(obj.beginDate)
                    .utc()
                    .format('YYYY-MM-DD');

            const hourPart =
                obj.beginTime &&
                moment(obj.beginTime)
                    .utc()
                    .format('HH:mm');

            const beginDatetime =
                dayPart &&
                hourPart &&
                moment(`${dayPart}T${hourPart}:00.000Z`).toISOString();

            return {
                ..._.omit(obj, [ 'beginDate', 'beginTime', 'station' ]),
                stationNum: obj.station,
                beginDatetime,
            };
        });

    const stationLoads = _.each(stationLoadsEntity);

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
        stationLoads,
        appurtenanciesResponsibleId: _.get(
            orderFields,
            'appurtenanciesResponsible',
        ),
        employeeId:       _.get(orderFields, 'employee'),
        stationNum:       _.get(orderFields, 'stationLoads[0].station'),
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
    let statuses = {
        invite: [ 'clientVehicle', 'manager', 'clientPhone' ],
        call:   [ 'clientPhone', 'manager' ],

        not_complete: [ 'manager' ],
        required:     [ 'manager' ],

        reserve: [ 'stationLoads[0].beginDate', 'stationLoads[0].beginTime', 'manager', 'station' ],
        approve: [ 'stationLoads[0].beginDate', 'stationLoads[0].beginTime', 'manager', 'clientPhone', 'station' ],

        redundant: [],
        cancel:    [],

        progress: [ 'stationLoads[0].beginDate', 'stationLoads[0].beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station', 'deliveryDate', 'deliveryTime' ],

        success: [ 'stationLoads[0].beginDate', 'stationLoads[0].beginTime', 'manager', 'clientPhone', 'clientVehicle', 'station'],
    };

    if (values[ 'stationLoads[0].beginTime' ] || values [ 'stationLoads[0].beginDate' ]) {
        statuses = _.mapValues(statuses, fields =>
            _.uniq([ ...fields, 'stationLoads[0].beginTime', 'stationLoads[0].beginDate' ]));
    }

    if (values.deliveryDate || values.deliveryTime) {
        statuses = _.mapValues(statuses, fields =>
            _.uniq([ ...fields, 'deliveryDate', 'deliveryTime' ]));
    }

    return statuses;
};
