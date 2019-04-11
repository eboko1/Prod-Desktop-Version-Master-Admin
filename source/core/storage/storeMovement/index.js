/**
 * Constants
 **/
export const moduleName = 'storeMovement';
const prefix = `cbp/${moduleName}`;

export const FETCH_STORE_MOVEMENT = `${prefix}/FETCH_STORE_MOVEMENT`;
export const FETCH_STORE_MOVEMENT_SUCCESS = `${prefix}/FETCH_STORE_MOVEMENT_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    storeMovementData: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_MOVEMENT_SUCCESS:
            return { ...state, storeMovement: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreStoreMovement = state =>
    stateSelector(state).storeMovement;

/**
 * Action Creators
 **/

export const fetchStoreMovement = () => ({
    type: FETCH_STORE_MOVEMENT,
});

export const fetchStoreMovementSuccess = storeMovement => ({
    type:    FETCH_STORE_MOVEMENT_SUCCESS,
    payload: storeMovement,
});
