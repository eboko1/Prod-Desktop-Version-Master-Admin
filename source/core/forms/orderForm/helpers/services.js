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
