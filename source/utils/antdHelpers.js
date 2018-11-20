import _ from 'lodash';

export const isField = value =>
    _.isObject(value) && _.has(value, 'value') && _.isString(value.name);

export const extractFieldsConfigs = config => {
    // TODO lodash
    return _(config)
        .values()
        .filter(Boolean)
        .map(value => {
            if (isField(value)) {
                return [ value ];
            } else if (_.isObject(value)) {
                return _.values(extractFieldsConfigs(value));
            }

            return [];
        })
        .flattenDeep()
        .map(value => [ value.name, value ])
        .fromPairs()
        .value();
};
