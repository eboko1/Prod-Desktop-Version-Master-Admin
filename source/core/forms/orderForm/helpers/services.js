import _ from 'lodash';
import { generateNestedObject, customFieldValue } from './utils';

function hasService(allServices, serviceId, type) {
    const allServicesKeys = allServices.map(
        ({ serviceId, type }) => `${type}|${serviceId}`,
    );

    return allServicesKeys.includes(`${type}|${serviceId}`);
}

export const mapOrderServicesToSelectServices = (orderServices, allServices) =>
    _.fromPairs(
        orderServices.map(({ serviceId, type, count, price, employeeId }) => {
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
                        employeeId || void 0,
                    ),
                    servicePrice: customFieldValue(
                        `services[${type}|${serviceId}][servicePrice]`,
                        Number(price) || 0,
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

export const defaultServices = () => {
    const defaultValues = { serviceCount: 1, servicePrice: 0 };
    const fields = [ 'serviceName', 'serviceCount', 'servicePrice', 'employeeId' ];

    return generateNestedObject(
        fields,
        (randomName, name) => `services[${randomName}][${name}]`,
        defaultValues,
    );
};
