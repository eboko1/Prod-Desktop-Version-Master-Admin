import _ from 'lodash';
import { generateNestedObject, customFieldValue } from './utils';

function hasService(allServices, serviceId, type) {
    const allServicesKeys = allServices.map(
        ({ serviceId, type }) => `${type}|${serviceId}`,
    );

    return allServicesKeys.includes(`${type}|${serviceId}`);
}

export const mapOrderServicesToSelectServices = (orderServices, allServices, globalEmployeeId) =>
    _.fromPairs(
        orderServices.map(({ serviceId, type, count, price, employeeId, ownDetail }) => {
            const custom = !hasService(allServices, serviceId, type);

            return [
                `${type}|${serviceId}`,
                {
                    serviceName: customFieldValue(
                        `services[${type}|${serviceId}][serviceName]`,
                        custom ? `custom|${serviceId}` : `${type}|${serviceId}`,
                    ),
                    serviceCount: customFieldValue(
                        `services[${type}|${serviceId}][serviceCount]`,
                        Number(count) || 0,
                    ),
                    employeeId: customFieldValue(
                        `services[${type}|${serviceId}][employeeId]`,
                        employeeId || globalEmployeeId || void 0,
                    ),
                    servicePrice: customFieldValue(
                        `services[${type}|${serviceId}][servicePrice]`,
                        Number(price) || 0,
                    ),
                    ownDetail: customFieldValue(
                        `details[${type}|${serviceId}][ownDetail]`,
                        ownDetail,
                        { dirty: false },
                    ),
                },
            ];
        }),
    );

export const generateAllServices = (prevAllServices, selectedServices) => {
    const selectedValues = _(selectedServices)
        .values()
        .map('serviceName')
        .map('value')
        .value();

    const manuallyInsertedServices = prevAllServices.filter(
        service => service.manuallyInserted,
    );

    const redundantManuallyInsertedServices = manuallyInsertedServices.filter(
        ({ id }) => !selectedValues.includes(`custom|${id}`),
    );

    return _.differenceWith(
        prevAllServices,
        redundantManuallyInsertedServices,
        _.isEqual,
    );
};

export const mergeServices = (allServices, orderServices) => {
    const allServicesKeys = allServices.map(
        ({ serviceId, type }) => `${type}|${serviceId}`,
    );
    const requiredOrderServices = orderServices
        .filter(
            ({ serviceId, type }) =>
                !allServicesKeys.includes(`${type}|${serviceId}`),
        )
        .map(({ serviceId, serviceName }) => ({
            id:           serviceId,
            serviceName,
            servicePrice: null,
            serviceHours: null,
            description:  '',
            serviceId,
            type:         'custom',
        }));

    return [ ...allServices, ...requiredOrderServices ];
};

export const defaultServices = (employeeId) => {
    const defaultValues = { serviceCount: 1, servicePrice: 0, employeeId, ownDetail: false };
    const fields = [ 'serviceName', 'serviceCount', 'servicePrice', 'employeeId', 'ownDetail' ];

    return generateNestedObject(
        fields,
        (randomName, name) => `services[${randomName}][${name}]`,
        defaultValues,
    );
};
