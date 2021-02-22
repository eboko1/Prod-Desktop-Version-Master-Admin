/**
 * Constants
 **/
export const moduleName = 'storageDocuments';
const prefix = `cbp/${moduleName}`;

export const FETCH_STORAGE = `${prefix}/FETCH_STORAGE`;
export const FETCH_STORAGE_SUCCESS = `${prefix}/FETCH_STORAGE_SUCCESS`;
export const FETCH_STORAGE_FAIL = `${prefix}/FETCH_STORAGE_FAIL`;

/**
 * Reducer
 **/

const ReducerState = {
    storageDocuments: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORAGE_SUCCESS:
            return { ...state, ...payload };

        default:
            return state;
    }
}

/**
 * Action Creators
 **/

export const fetchStorage = type => ({
    type:    FETCH_STORAGE,
    payload: type,
});

export const fetchStorageSuccess = storageDocuments => ({
    type:    FETCH_STORAGE_SUCCESS,
    payload: storageDocuments,
});

export const fetchStorageFail = error => ({
    type:    FETCH_ORDER_FAIL,
    payload: error,
    error:   true,
});
