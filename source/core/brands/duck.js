/**
 * Constants
 * */
export const moduleName = 'brands';
const prefix = `cpb/${moduleName}`;

export const FETCH_BRANDS = `${prefix}/FETCH_BRANDS`;
export const FETCH_BRANDS_SUCCESS = `${prefix}/FETCH_BRANDS_SUCCESS`;

export const CREATE_BRAND_PRIORITY = `${prefix}/CREATE_BRAND_PRIORITY`;

export const ON_CHANGE_BRANDS_FORM = `${prefix}/ON_CHANGE_BRANDS_FORM`;

export const UPDATE_BRAND = `${prefix}/UPDATE_BRAND`;
export const CREATE_BRAND = `${prefix}/CREATE_BRAND`;
export const DELETE_BRAND = `${prefix}/DELETE_BRAND`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
    brands: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_BRANDS_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_BRANDS_SUCCESS:
            return {
                ...state,
                brands: payload,
            };

        case UPDATE_BRAND:
            return {
                ...state,
                editBrandId: null,
            };

        case CREATE_BRAND:
            return {
                ...state,
                createBrandForm: false,
            };

        default:
            return state;
    }
}

export const onChangeBrandsForm = update => ({
    type:    ON_CHANGE_BRANDS_FORM,
    payload: update,
});

export const fetchBrands = businessId => ({
    type:    FETCH_BRANDS,
    payload: businessId,
});

export const fetchBrandsSuccess = data => ({
    type:    FETCH_BRANDS_SUCCESS,
    payload: data,
});

export const updateBrand = (brandId, entity) => ({
    type:    UPDATE_BRAND,
    payload: { brandId, entity },
});

export const createBrand = (brandId, entity) => ({
    type:    CREATE_BRAND,
    payload: { brandId, entity },
});

export const deleteBrand = id => ({
    type:    DELETE_BRAND,
    payload: id,
});
