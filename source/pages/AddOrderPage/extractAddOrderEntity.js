import _ from 'lodash';

export function convertFieldsValuesToDbEntity(orderFields, allServices, allDetails) {
    const services = _(orderFields.services)
        .values()
        .filter(service => _.get(service, 'serviceName.value'))
        .map(service => {
            const {
                serviceName: { value: name },
                servicePrice: { value: price },
                serviceCount: { value: count },
            } = service;
            const [ type, serviceId ] = name.split('|');
            const label = (
                allServices.find(({ id, type }) => `${type}|${id}` === name) ||
                {}
            ).serviceName;

            const baseService = { price, count, hours: null };
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

            const baseDetail = { price, count, ownDetail: false, code };
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
        status:              'not_complete',
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
        comment:             _.get(orderFields, 'comment.value'),
    };

    return order;
};