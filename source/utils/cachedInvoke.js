import _ from 'lodash';

export default class CachedInvoke {
    constructor() {
        this._cachedMap = new Map();
    }

    getCachedResult(func, args, context = null) {
        if (!this._cachedMap.get(func)) {
            this._cachedMap.set(func, []);
        }

        const cacheArray = this._cachedMap.get(func);

        const cachedItem = _.find(cacheArray, ({ itemArgs }) =>
            _.isEqual(itemArgs, args));
        if (cachedItem) {
            return cachedItem.value;
        }

        const value = func.apply(context, args);
        cacheArray.push({ value, itemArgs: args });

        return value;
    }
}
