// const brands = props.brands.map(({ brandId, brandName }) => (
//     <Option value={ String(brandId) } key={ `allBrands-${brandId}` }>
//         { brandName }
//     </Option>
// ));

// const localizationMap = {};

// const _getLocalization = key => {
//     if (!localizationMap[ key ]) {
//         localizationMap[ key ] = formatMessage({ id: key });
//     }

//     return localizationMap[ key ];
// };

// const func = requiredLimitedOptions;
// const brandArray = [
//     _.chain(formDetails)
//         .get(key)
//         .pick('detailBrandName')
//         .value(),
// ].filter(Boolean);

// const args = [
//     brandArray,
//     'detailBrandName',
//     'brandName',
//     brands,
//     'brandId',
// ];

// const defaultBrands = this._cachedInvoke.getCachedResult(func, args);

