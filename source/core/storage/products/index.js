/**
 * Constants
 **/
export const moduleName = 'store_products';
const prefix = `cpb/${moduleName}`;

export const PRODUCTS_EXCEL_IMPORT = `${prefix}/PRODUCTS_EXCEL_IMPORT`;
export const PRODUCTS_EXCEL_IMPORT_RESET = `${prefix}/PRODUCTS_EXCEL_IMPORT_RESET`;
export const PRODUCTS_EXCEL_IMPORT_REQUEST = `${prefix}/PRODUCTS_EXCEL_IMPORT_REQUEST`;
export const PRODUCTS_EXCEL_IMPORT_SUCCESS = `${prefix}/PRODUCTS_EXCEL_IMPORT_SUCCESS`;

export const FETCH_PRODUCTS = `${prefix}/FETCH_PRODUCTS`;
export const FETCH_PRODUCTS_SUCCESS = `${prefix}/FETCH_PRODUCTS_SUCCESS`;

export const FETCH_PRODUCT = `${prefix}/FETCH_PRODUCT`;
export const FETCH_PRODUCT_SUCCESS = `${prefix}/FETCH_PRODUCT_SUCCESS`;
export const CREATE_PRODUCT = `${prefix}/CREATE_PRODUCT`;
export const CREATE_PRODUCT_SUCCESS = `${prefix}/CREATE_PRODUCT_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    products:      [],
    productsExcel: [],
    product:       {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case PRODUCTS_EXCEL_IMPORT:
            return { ...state, productsExcel: [ ...payload ] };

        case PRODUCTS_EXCEL_IMPORT_RESET:
            return { ...state, productsExcel: ReducerState.productsExcel };

        case FETCH_PRODUCTS_SUCCESS:
            return { ...state, products: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreProducts = state => stateSelector(state).products;
export const selectStoreProductsExcel = state =>
    stateSelector(state).productsExcel;

/**
 * Action Creators
 **/

// products
export const fetchProducts = () => ({
    type: FETCH_PRODUCTS,
});

export const fetchProductsSuccess = products => ({
    type:    FETCH_PRODUCTS_SUCCESS,
    payload: products,
});

// product
export const fetchProduct = () => ({
    type: FETCH_PRODUCT,
});

export const fetchProductSuccess = product => ({
    type:    FETCH_PRODUCT_SUCCESS,
    payload: product,
});

export const createProduct = product => ({
    type:    CREATE_PRODUCT,
    payload: product,
});

export const createProductSuccess = () => ({
    type: CREATE_PRODUCT_SUCCESS,
});

// productsExcel
export const productsExcelImport = file => ({
    type:    PRODUCTS_EXCEL_IMPORT,
    payload: file,
});

export const productsExcelImportReset = () => ({
    type: PRODUCTS_EXCEL_IMPORT_RESET,
});

export const productsExcelImportSuccess = payload => ({
    type: PRODUCTS_EXCEL_IMPORT_SUCCESS,
    payload,
});
