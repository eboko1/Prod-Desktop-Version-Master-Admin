global.fetch = jest.fn((url, options) =>
    Promise.resolve({
        status: 200,
    }));

global.localStorage = new class LocalStorage {
    constructor() {
        this.storage = {};
    }

    clear = jest.fn(() => {
        this.storage = {};
    });

    getItem = jest.fn(key => {
        return this.storage[ key ] || null;
    });

    setItem = jest.fn((key, value) => {
        this.storage[ key ] = JSON.stringify(value);
    });

    removeItem = jest.fn(key => {
        delete this.storage[ key ];
    });

    get length() {
        return Object.keys(this.storage).length;
    }
}();
