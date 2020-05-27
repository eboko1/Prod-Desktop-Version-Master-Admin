import _ from 'lodash';

// function helper for servicesStats & detailsStats
function calculateStats(entries) {
    const price = entries.reduce(
        (prev, { price, count }) => prev + count * price,
        0,
    );
    const count = entries.length;

    return { price: price.toFixed(2), count };
}

// count sum and total hours for SERVICES tab
export const servicesStats = (selectedServices, allServices) => {
    const selectedSimpleServices = _(selectedServices)
        .filter(service => _.get(service, 'serviceName'))
        .map(({ laborId, servicePrice, serviceHours, serviceName, primeCost }) => ({
            price:          !_.isNil(servicePrice) ? servicePrice : 0,
            hours:          !_.isNil(serviceHours) ? serviceHours : 0,
            count:          !_.isNil(serviceHours) ? serviceHours : 0,
            id:             laborId ? laborId : serviceName,
            name:           serviceName,
            servicesProfit:
                !_.isNil(primeCost) &&
                !_.isNil(servicePrice) &&
                !_.isNil(serviceHours)
                    ? (servicePrice - primeCost) * serviceHours
                    : 0,
        }))
        .value();

    const totalHours = selectedSimpleServices.reduce(
        (prev, { hours }) =>
            prev + hours,
        0,
    );

    const totalServicesProfit = selectedSimpleServices
        .reduce(
            (accumulator, { servicesProfit }) => accumulator + servicesProfit,
            0,
        )
        .toFixed(2);
    /* Marian service table fix
    const allServicesHours = _(allServices)
        .map(({ id, type, serviceHours }) => [ `${type}|${id}`, ~~serviceHours ])
        .fromPairs()
        .value();

    const totalHours = selectedSimpleServices.reduce(
        (prev, { id, count }) =>
            prev + (Number(allServicesHours[ id ]) || 0) * count,
        15,
    );

    const totalServicesProfit = selectedSimpleServices
        .reduce(
            (accumulator, { servicesProfit }) => accumulator + servicesProfit,
            0,
        )
        .toFixed(2); */
    return {
        ...calculateStats(selectedSimpleServices),
        totalServicesProfit,
        totalHours: (Math.ceil(totalHours / 60 * 2) || 1) / 2,
    };
};

//  count sum and total hours for DETAILS tab
export const detailsStats = selectedDetails => {
    const selectedSimpleDetails = _(selectedDetails)
        .values()
        .filter(
            detail => _.get(detail, 'detailName') || _.get(detail, 'productId'),
        )
        .map(item => {
            const {
                detailPrice,
                purchasePrice,
                detailCount,
                detailName,
            } = item;

            return {
                price:         !_.isNil(detailPrice) ? detailPrice : 0,
                count:         !_.isNil(detailCount) ? detailCount : 0,
                purchasePrice: purchasePrice,
                id:            detailName,
                detailsProfit:
                    !_.isNil(purchasePrice) &&
                    !_.isNil(detailPrice) &&
                    !_.isNil(detailCount)
                        ? (detailPrice - purchasePrice) * detailCount
                        : 0,
            };
        })
        .value();

    const totalDetailsProfit = selectedSimpleDetails
        .reduce(
            (accumulator, { detailsProfit }) => accumulator + detailsProfit,
            0,
        )
        .toFixed(2);

    return {
        ...calculateStats(selectedSimpleDetails),
        totalDetailsProfit,
    };
};
