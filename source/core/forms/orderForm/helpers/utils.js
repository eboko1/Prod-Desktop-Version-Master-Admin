import { v4 } from 'uuid';
import _ from 'lodash';

export const customFieldValue = (name, value, props = {}) => ({
    errors:     void 0,
    name:       name,
    touched:    true,
    validating: false,
    value:      value,
    dirty:      true,
    ...props,
});

export const defaultFieldValue = name => customFieldValue(name, void 0);

export const customDetail = payload => ({
    detailId:         `custom|${v4()}`,
    detailName:       payload,
    manuallyInserted: true,
});

export const generateNestedObject = (
    fields,
    fieldNameGenerator,
    defaultValues = {},
) => {
    const randomName = v4();
    const pairs = fields.map(name => [
        name,
        customFieldValue(
            fieldNameGenerator(randomName, name),
            defaultValues[ name ],
        ),
    ]);

    return {
        [ randomName ]: _.fromPairs(pairs),
    };
};
