import _ from 'lodash';

function calculateStats(entires) {
    const price = entires.reduce(
        (prev, { price, count }) => prev + count * price,
        0,
    );
    const count = entires.length;

    return { price, count };
}

export const servicesStats = (selectedServices, allServices) => {
    const selectedSimpleServices = _(selectedServices)
        .values()
        .filter(service => _.get(service, 'serviceName.value'))
        .map(service => ({
            price: Number(_.get(service, 'servicePrice.value')) || 0,
            count: Number(_.get(service, 'serviceCount.value')) || 0,
            id:    _.get(service, 'serviceName.value'),
        }))
        .value();

    const allServicesHours = _(allServices)
        .map(({ id, type, serviceHours }) => [ `${type}|${id}`, ~~serviceHours ])
        .fromPairs()
        .value();

    const totalHours = selectedSimpleServices.reduce(
        (prev, { id, count }) => prev + (Number(allServicesHours[ id ]) || 0) * count,
        15,
    );

    return { ...calculateStats(selectedSimpleServices), totalHours };
};

export const detailsStats = (selectedDetails) => {
    const selectedSimpleDetails = _(selectedDetails)
        .values()
        .filter(detail => _.get(detail, 'detailName.value'))
        .map(service => ({
            price: Number(_.get(service, 'detailPrice.value')) || 0,
            count: Number(_.get(service, 'detailCount.value')) || 0,
            id:    _.get(service, 'detailName.value'),
        }))
        .value();

    return calculateStats(selectedSimpleDetails);
};
