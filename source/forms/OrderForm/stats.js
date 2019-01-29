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
        .map(({ servicePrice, serviceCount, serviceName, primeCost }) => ({
            price:          !_.isNil(servicePrice) ? servicePrice : 0,
            count:          !_.isNil(serviceCount) ? serviceCount : 0,
            id:             serviceName,
            servicesProfit:
                !_.isNil(primeCost) &&
                !_.isNil(servicePrice) &&
                !_.isNil(serviceCount)
                    ? (servicePrice - primeCost) * serviceCount
                    : 0,
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

    const totalServicesProfit = {
        totalServicesProfit: selectedSimpleServices.reduce(
            (accumulator, { servicesProfit }) => accumulator + servicesProfit,
            0,
        ),
    };

    return {
        ...calculateStats(selectedSimpleServices),
        ...totalServicesProfit,
        totalHours: (Math.ceil(totalHours / 60 * 2) || 1) / 2,
    };
};

//  count sum and total hours for DETAILS tab
export const detailsStats = selectedDetails => {
    const selectedSimpleDetails = _(selectedDetails)
        .values()
        .filter(detail => _.get(detail, 'detailName'))
        .map(({ detailPrice, purchasePrice, detailCount, detailName }) => {
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

    const totalDetailsProfit = {
        totalDetailsProfit: selectedSimpleDetails.reduce(
            (accumulator, { detailsProfit }) => accumulator + detailsProfit,
            0,
        ),
    };

    return {
        ...calculateStats(selectedSimpleDetails),
        ...totalDetailsProfit,
    };
};
