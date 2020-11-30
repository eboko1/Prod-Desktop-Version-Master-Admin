// vendor
import _ from 'lodash';
import moment from 'moment';

// proj
import { permissions, isForbidden } from 'utils';

/* eslint-disable complexity */
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
                serviceHours: hours,
                laborId: laborId,
                agreement: agreement,
                comment: comment,
            } = service;

            const serviceConfig = allServices.find(
                ({ id, type }) => `${type}|${id}` === name,
            );

            const baseService = { price, count, hours, employeeId, ownDetail };
            const serviceType = !serviceConfig
                ? { type: 'custom', serviceName: name }
                : { type: name.split('|')[ 0 ], serviceId: name.split('|')[ 1 ] };

            var result = {};

            if (name) { result.serviceName = name; }
            if (laborId) { result.serviceId = laborId; }
            if (price) { result.servicePrice = price; }
            if (employeeId) { result.employeeId = employeeId; }
            if (hours) { result.serviceHours = hours; }
            if (agreement) { result.agreement = agreement; }
            if (comment) { result.comment = { comment: comment }; }

            return result;
        })
        .value();
    const details = _(orderFields.details)
        .filter(Boolean)
        .filter(
            detail => _.get(detail, 'detailName') || _.get(detail, 'productId'),
        )
        .map(detail => {
            const {
                detailName: detailId,
                detailPrice: price,
                detailCount: count,
                detailCode: code,
                detailBrandName: brandId,
                purchasePrice: purchasePrice,
                storage: storage,
                productId: productId,
                productCode: productCode,
                storeGroupId: storeGroupId,
                agreement: agreement,
                // using: using,
            } = detail;
            const detailConfig = allDetails.details.find(
                ({ detailId: id }) => String(id) === detailId,
            );
            let detailCustom = { detailId };

            if (storage) {
                detailCustom = { productId };
            } else if (!detailConfig) {
                detailCustom = { name: detailId };
            }

            const brandConfig = allDetails.brands.find(
                ({ brandId: id }) => String(id) === brandId,
            );

            const baseDetail = {
                storeGroupId,
                code,
                productCode,
                price,
                count,
                purchasePrice,
            };

            let brandCustom = {};
            if (!brandConfig) {
                if (brandId) {
                    brandCustom = { brandName: brandId };
                }
            } else {
                brandCustom = { brandId };
            }

            return {
                storeGroupId:  storeGroupId ? storeGroupId : null,
                agreement:     agreement,
                price:         price,
                count:         count,
                purchasePrice: purchasePrice,
                /* Marian details table fix / save button fix
                ...baseDetail,
                ...detailCustom,
                ...brandCustom,
                // ...storage && using ? { using } : {}, */
            };
        })
        .value();
    const beginDate = _.get(orderFields, 'stationLoads[0].beginDate');
    const beginTime = _.get(orderFields, 'stationLoads[0].beginTime');

    const deliveryDate = _.get(orderFields, 'deliveryDate');
    const deliveryTime = _.get(orderFields, 'deliveryTime');

    // TODO: refactor for utils concatDateTime
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
        deliveryDayPart && deliveryHourPart
            ? moment(
                `${deliveryDayPart}T${deliveryHourPart}:00.000Z`,
            ).toISOString() // eslint-disable-next-line no-extra-parens
            : status === 'success'
                ? moment(new Date()).toISOString()
                : null;

    const orderDuration = _.get(orderFields, 'stationLoads[0].duration');
    const stationLoadsEntity = _.get(orderFields, 'stationLoads')
        .filter(
            ({ beginDate, beginTime }) => ![ beginDate, beginTime ].some(_.isNil),
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
    // TODO: rewrite this method
    // prepare order to request format
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
        insertMode:       true,
        updateRepairMap:  true,
    };

    const orderClearedFields = _.mapValues(order, value =>
        value === '' ? null : value);
    // omit forbidden fields
    const rolesOmitFieldsFunctions = [
        orderEntity =>
            isForbidden(user, permissions.ACCESS_ORDER_COMMENTS)
                ? _.omit(orderEntity, [
                    'recommendation',
                    'vehicleCondition',
                    'businessComment',
                    'comment',
                ])
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
                ? _.pick(orderEntity, [
                    'recommendation',
                    'vehicleCondition',
                    'businessComment',
                    'comment',
                    'status',
                    'services',
                    'servicesDiscount',
                    'details',
                    'detailsDiscount',
                ])
                : orderEntity,
    ];

    return rolesOmitFieldsFunctions.reduce(
        (prev, current) => current(prev),
        orderClearedFields,
    );
}

// required fields list ( Form rules helper)
export const requiredFieldsOnStatuses = values => {
    /* eslint-disable camelcase */
    let statuses = {
        invite: [
            'clientVehicle',
            'manager',
            'clientPhone',
            'services',
            'details',
        ],
        call: [
            'clientPhone',
            'manager',
            'services',
            'details', 
        ],
        not_complete: [ 'manager', 'services', 'details' ],
        required:     [ 'manager', 'services', 'details' ],
        reserve:      [
            'stationLoads[0].beginDate',
            'stationLoads[0].beginTime',
            'manager',
            'station',
            'services',
            'details',
        ],
        approve: [
            'stationLoads[0].beginDate',
            'stationLoads[0].beginTime',
            'manager',
            'clientPhone',
            'station',
            'services',
            'details',
        ],
        redundant: [ 'services', 'details' ],
        cancel:    [ 'services', 'details' ],
        progress:  [
            'stationLoads[0].beginDate',
            'stationLoads[0].beginTime',
            'manager',
            'clientPhone',
            'clientVehicle',
            'station',
            'deliveryDate',
            'deliveryTime',
            'services',
            'details',
        ],
        success: [
            'stationLoads[0].beginDate',
            'stationLoads[0].beginTime',
            'manager',
            'clientPhone',
            'clientVehicle',
            'station',
            'services',
            'details',
        ],
    };

    if (
        values[ 'stationLoads[0].beginTime' ] ||
        values[ 'stationLoads[0].beginDate' ]
    ) {
        statuses = _.mapValues(statuses, fields =>
            _.uniq([ ...fields, 'stationLoads[0].beginTime', 'stationLoads[0].beginDate' ]));
    }

    if (values.deliveryDate || values.deliveryTime) {
        statuses = _.mapValues(statuses, fields =>
            _.uniq([ ...fields, 'deliveryDate', 'deliveryTime' ]));
    }

    return statuses;
};
