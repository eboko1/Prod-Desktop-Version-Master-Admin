module.exports = {
    createBrowserHistory() {
        return {
            action:     '__TEST_ACTION__',
            block:      jest.fn(),
            createHref: jest.fn(),
            go:         jest.fn(),
            goBack:     jest.fn(),
            goForward:  jest.fn(),
            length:     6,
            listen:     jest.fn(),
            push:       jest.fn(),
            replace:    jest.fn(),
            location:   {
                hash:     '__TEST_HASH__',
                key:      '__TEST_KEY__',
                pathname: '/__TEST_PATH__',
                search:   '__TEST_SERACH__',
                state:    void 0,
            },
        };
    },
};
