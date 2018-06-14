module.exports = {
    configure: jest.fn().mockName('configure'),
    start:     jest.fn().mockName('start'),
    done:      jest.fn().mockName('done'),
};
