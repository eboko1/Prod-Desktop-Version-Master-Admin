import _ from 'lodash';

export default function() {
    const cachedMap = new Map();

    return function cache(func, args, context = null) {
        if (!cachedMap.get(func)) {
            cachedMap.set(func, []);
        }

        const cacheArray = cachedMap.get(func);

        const cachedItem = _.find(cacheArray, ({ itemArgs }) =>
            _.isEqual(itemArgs, args));
        if (cachedItem) {
            return cachedItem.value;
        }

        const value = func.apply(context, args);
        cacheArray.push({ value, itemArgs: args });

        return value;
    };
}
