import store from '../store';

describe('store:', () => {
    test('should return a valid state shape', () => {
        expect(store.getState()).toMatchSnapshot();
        // expect(store.getState()).toEqual(testStore.getState());
    });
});
