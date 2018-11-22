import _ from 'lodash';

// function helper for servicesStats & detailsStats
function calculateStats(entries) {
    const price = entries.reduce(
        (prev, { price, count }) => prev + count * price,
        0,
    );
    const count = entries.length;

    return { price, count };
}

// count sum and total hours for SERVICES tab
export const servicesStats = (selectedServices, allServices) => {
    const selectedSimpleServices = _(selectedServices)
        .filter(service => _.get(service, 'serviceName'))
        .map(service => ({
            price: _.get(service, 'servicePrice'),
            count: _.get(service, 'serviceCount'),
            id:    _.get(service, 'serviceName'),
        }))
        .value();

    const allServicesHours = _(allServices)
        .map(({ id, type, serviceHours }) => [ `${type}|${id}`, ~~serviceHours ])
        .fromPairs()
        .value();

    const totalHours = selectedSimpleServices.reduce(
        (prev, { id, count }) =>
            prev + (Number(allServicesHours[ id ]) || 0) * count,
        15,
    );

    return {
        ...calculateStats(selectedSimpleServices),
        totalHours: (Math.ceil(totalHours / 60 * 2) || 1) / 2,
    };
};

//  count sum and total hours for DETAILS tab
export const detailsStats = selectedDetails => {
    const selectedSimpleDetails = _(selectedDetails)
        .values()
        .filter(detail => _.get(detail, 'detailName'))
        .map(service => ({
            price: _.get(service, 'detailPrice'),
            count: _.get(service, 'detailCount'),
            id:    _.get(service, 'detailName'),
        }))
        .value();

    return calculateStats(selectedSimpleDetails);
};
