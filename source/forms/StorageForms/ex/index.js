const _ = require('lodash');

const values = {
    '0.price':       2000,
    '0.productName': 'Пюрешка',
    '1.price':       1500,
    '1.productName': 'Котлетка',
};

console.log('toPairs', _.toPairs(values));

console.log(
    _.toPairs(values).reduce((result, [ name, value ]) => {
        console.log('result', result);
        console.log('name, value', name, value);

        return _.set(result, name, value);
    }, []),
);
