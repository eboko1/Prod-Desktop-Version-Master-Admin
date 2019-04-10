/**
 * Constants
 **/
export const moduleName = 'storage';
const prefix = `GLOBAL/${moduleName}`;

export const PRODUCTS_EXCEL_IMPORT = `${prefix}/PRODUCTS_EXCEL_IMPORT`;
export const PRODUCTS_EXCEL_IMPORT_RESET = `${prefix}/PRODUCTS_EXCEL_IMPORT_RESET`;
export const PRODUCTS_EXCEL_IMPORT_REQUEST = `${prefix}/PRODUCTS_EXCEL_IMPORT_REQUEST`;
export const PRODUCTS_EXCEL_IMPORT_SUCCESS = `${prefix}/PRODUCTS_EXCEL_IMPORT_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    products:      [],
    productsExcel: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case PRODUCTS_EXCEL_IMPORT:
            return { ...state, productsExcel: [ ...payload ] };

        case PRODUCTS_EXCEL_IMPORT_RESET:
            return { ...state, productsExcel: ReducerState.productsExcel };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

/**
 * Action Creators
 **/

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
