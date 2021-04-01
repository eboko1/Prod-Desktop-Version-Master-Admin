/**
 * Constants
 **/

export const moduleName = 'brands';
const prefix = `cpb/${moduleName}`;

export const FETCH_BRANDS = `${prefix}/FETCH_BRANDS`;
export const FETCH_BRANDS_SUCCESS = `${prefix}/FETCH_BRANDS_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    brands: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_BRANDS_SUCCESS:
            return { 
                ...state, 
                brands: payload
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];
export const selectBrands = state => state[ moduleName ].brands;

/**
 * Action Creators
 **/

export const fetchBrands = () => ({
    type: FETCH_BRANDS,
});

export const fetchBrandsSuccess = brands => ({
    type:    FETCH_BRANDS_SUCCESS,
    payload: brands,
});
