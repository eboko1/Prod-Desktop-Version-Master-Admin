/**
 * Constants
 **/
export const moduleName = 'store_groups';
const prefix = `cpb/${moduleName}`;

export const FETCH_STORE_GROUPS = `${prefix}/FETCH_STORE_GROUPS`;
export const FETCH_STORE_GROUPS_SUCCESS = `${prefix}/FETCH_STORE_GROUPS_SUCCESS`;

export const CREATE_STORE_GROUP = `${prefix}/CREATE_STORE_GROUP`;
export const CREATE_STORE_GROUP_SUCCESS = `${prefix}/CREATE_STORE_GROUP_SUCCESS`;
export const UPDATE_STORE_GROUP = `${prefix}/UPDATE_STORE_GROUP`;
export const UPDATE_STORE_GROUP_SUCCESS = `${prefix}/UPDATE_STORE_GROUP_SUCCESS`;
export const DELETE_STORE_GROUP = `${prefix}/DELETE_STORE_GROUP`;
export const DELETE_STORE_GROUP_SUCCESS = `${prefix}/DELETE_STORE_GROUP_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    storeGroups: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_GROUPS_SUCCESS:
            return { ...state, storeGroups: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreGroups = state => stateSelector(state).storeGroups;

/**
 * Action Creators
 **/

// storeGroups
export const fetchStoreGroups = () => ({
    type: FETCH_STORE_GROUPS,
});

export const fetchStoreGroupsSuccess = storeGroups => ({
    type:    FETCH_STORE_GROUPS_SUCCESS,
    payload: storeGroups,
});

export const createStoreGroup = storeGroup => ({
    type:    CREATE_STORE_GROUP,
    payload: storeGroup,
});

export const createStoreGroupSuccess = () => ({
    type: CREATE_STORE_GROUP_SUCCESS,
});

export const updateStoreGroup = storeGroup => ({
    type:    UPDATE_STORE_GROUP,
    payload: storeGroup,
});

export const updateStoreGroupSuccess = () => ({
    type: UPDATE_STORE_GROUP_SUCCESS,
});

export const deleteStoreGroup = storeGroup => ({
    type:    DELETE_STORE_GROUP,
    payload: storeGroup,
});

export const deleteStoreGroupSuccess = () => ({
    type: DELETE_STORE_GROUP_SUCCESS,
});
