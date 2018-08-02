import _ from 'lodash';

export function convertFieldsValuesToDbEntity(
    orderFields,
    allServices,
    allDetails,
    status = 'not_complete',
) {
    const services = _(orderFields.services)
        .values()
        .filter(service => _.get(service, 'serviceName.value'))
        .map(service => {
            const {
                serviceName: { value: name },
                servicePrice: { value: price },
                serviceCount: { value: count },
                employeeId: { value: employeeId },
                ownDetail: { value: ownDetail },
            } = service;
            const [ type, serviceId ] = name.split('|');
            const label = (
                allServices.find(({ id, type }) => `${type}|${id}` === name) ||
                {}
            ).serviceName;

            const baseService = { price, count, hours: null, employeeId, ownDetail };
            const serviceType =
                type === 'custom'
                    ? { type, serviceName: label }
                    : { type, serviceId };

            return { ...baseService, ...serviceType };
        });

    const details = _(orderFields.details)
        .values()
        .filter(detail => _.get(detail, 'detailName.value'))
        .map(detail => {
            const {
                detailName: { value: detailId },
                detailPrice: { value: price },
                detailCount: { value: count },
                detailCode: { value: code },
                detailBrandName: { value: brandId },
            } = detail;
            const [ detailType ] = String(detailId).split('|');
            const [ brandType ] = String(brandId).split('|');

            const detailLabel = (
                allDetails.details.find(
                    ({ detailId: id }) => id === detailId,
                ) || {}
            ).detailName;
            const brandLabel = (
                allDetails.brands.find(({ brandId: id }) => id === brandId) ||
                {}
            ).brandName;

            const baseDetail = { price, count, code };
            const detailCustom =
                detailType === 'custom' ? { name: detailLabel } : { detailId };
            const brandCustom =
                brandType === 'custom'
                    ? { brandName: brandLabel }
                    : { brandId };

            return { ...baseDetail, ...detailCustom, ...brandCustom };
        });

    const order = {
        clientId:            _.get(orderFields, 'selectedClient.clientId'),
        status,
        clientVehicleId:     _.get(orderFields, 'clientVehicle.value'),
        businessRequisiteId: _.get(orderFields, 'requisite.value'),
        managerId:           _.get(orderFields, 'manager.value'),
        beginDatetime:       _.get(orderFields, 'beginDatetime.value'),
        clientPhone:         _.get(orderFields, 'clientPhone.value'),
        paymentMethod:       _.get(orderFields, 'paymentMethod.value'),
        clientRequisiteId:   _.get(orderFields, 'clientRequisite.value'),
        services,
        details,
        employeeId:          _.get(orderFields, 'employee.value'),
        stationNum:          _.get(orderFields, 'station.value'),
        detailsDiscount:     _.get(orderFields, 'detailsDiscount.value'),
        servicesDiscount:    _.get(orderFields, 'servicesDiscount.value'),
        odometerValue:       _.get(orderFields, 'odometerValue.value'),
        recommendation:      _.get(orderFields, 'recommendation.value'),
        vehicleCondition:    _.get(orderFields, 'vehicleCondition.value'),
        businessComment:     _.get(orderFields, 'businessComment.value'),
        comment:             _.get(orderFields, 'comment.value'),
    };

    return order;
}

export const requiredFieldsOnStatuses = {
    invite: [ 'clientVehicle', 'manager', 'clientPhone' ],
    call:   [ 'clientPhone', 'manager' ],

    not_complete: [ 'manager' ],
    required:     [ 'manager' ],

    reserve: [ 'beginDatetime', 'manager' ],
    approve: [ 'beginDatetime', 'manager', 'clientPhone' ],

    redundant: [],
    cancel:    [],

    progress: [ 'beginDatetime', 'manager', 'clientPhone', 'clientVehicle', 'station' ],

    success: [ 'beginDatetime', 'manager', 'clientPhone', 'clientVehicle', 'station' ],
};
