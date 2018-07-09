import _ from 'lodash';
import { v4 } from 'uuid';

import { customFieldValue, generateNestedObject } from './utils';

export const defaultDetails = () => {
    const defaultValues = { detailCount: 1, detailPrice: 0 };
    const fields = [ 'detailName', 'detailBrandName', 'detailCode', 'detailCount', 'detailPrice' ];

    return generateNestedObject(
        fields,
        (randomName, name) => `details[${randomName}][${name}]`,
        defaultValues,
    );
};

export const mapOrderDetailsToSelectDetails = details =>
    _.fromPairs(
        details.map(
            ({
                id,
                detailId,
                detailName,
                brandId,
                brandName,
                detailCode,
                price,
                count,
            }) => {
                const uniqueId = v4();

                return [
                    [ uniqueId ],
                    {
                        detailName: customFieldValue(
                            `details[${uniqueId}][detailName]`,
                            detailId || detailName
                                ? detailId || `custom|${id}`
                                : null,
                        ),
                        detailBrandName: customFieldValue(
                            `details[${uniqueId}][detailBrandName]`,
                            brandId || brandName
                                ? brandId || `custom|${id}`
                                : null,
                        ),
                        detailCode: customFieldValue(
                            `details[${uniqueId}][detailCode]`,
                            detailCode,
                        ),
                        detailCount: customFieldValue(
                            `details[${uniqueId}][detailCount]`,
                            Number(count) || 0,
                        ),
                        detailPrice: customFieldValue(
                            `details[${uniqueId}][detailPrice]`,
                            Number(price) || 0,
                        ),
                    },
                ];
            },
        ),
    );

export const generateAllDetails = (allDetails, selectedDetails) => {
    const selectedValues = _(selectedDetails)
        .values()
        .map('detailName')
        .map('value')
        .value();

    const manuallyInsertedDetails = allDetails.filter(
        detail => detail.manuallyInserted,
    );

    const redundantManuallyInsertedDetails = manuallyInsertedDetails.filter(
        ({ detailId }) => !selectedValues.includes(detailId),
    );

    return _.differenceWith(
        allDetails,
        redundantManuallyInsertedDetails,
        _.isEqual,
    );
};

export const mergeDetails = (allDetails, orderDetails) => {
    const requiredOrderDetails = orderDetails
        .filter(({ detailId }) => !detailId)
        .map(({ detailName, id }) => ({
            detailId: `custom|${id}`,
            detailName,
        }));

    return [ ...requiredOrderDetails, ...allDetails ];
};

export const getInitDetails = (allDetails, orderDetails) => {
    const customOrderDetailIds = orderDetails
        .filter(({ detailId }) => !detailId)
        .map(({ id }) => `custom|${id}`);

    const orderDetailIds = orderDetails
        .filter(({ detailId }) => detailId)
        .map(({ detailId }) => detailId);

    const mergedDetails = mergeDetails(allDetails, orderDetails);
    const requiredIds = [ ...customOrderDetailIds, ...orderDetailIds ];

    const baseDetails = mergedDetails.filter(({ detailId }) =>
        requiredIds.includes(detailId));

    return _.uniqWith(
        [ ...baseDetails, ...mergedDetails.slice(0, 100) ],
        _.isEqual,
    );
};
