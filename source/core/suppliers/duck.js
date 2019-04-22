// import { v4 } from 'uuid';

/**
 * Constants
 * */
export const moduleName = 'suppliers';
const prefix = `cpb/${moduleName}`;

export const FETCH_SUPPLIERS = `${prefix}/FETCH_SUPPLIERS`;
export const FETCH_SUPPLIERS_SUCCESS = `${prefix}/FETCH_SUPPLIERS_SUCCESS`;

export const CREATE_SUPPLIER = `${prefix}/CREATE_SUPPLIER`;
export const CREATE_SUPPLIER_SUCCESS = `${prefix}/CREATE_SUPPLIER_SUCCESS`;

export const DELETE_SUPPLIER = `${prefix}/DELETE_SUPPLIER`;
export const DELETE_SUPPLIER_SUCCESS = `${prefix}/DELETE_SUPPLIER_SUCCESS`;

/**
 * Reducer
 * */
const ReducerState = {
    suppliers: [],
};
// eslint-disable-next-line
export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_SUPPLIERS_SUCCESS:
            return {
                ...state,
                suppliers: payload,
            };

        case CREATE_SUPPLIER_SUCCESS:
            return {
                ...state,
                suppliers: [ ...state.suppliers, payload ],
            };

        case DELETE_SUPPLIER_SUCCESS:
            return {
                ...state,
                suppliers: [ ...state.suppliers, payload ],
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectSuppliers = state => state[ moduleName ].suppliers;

/**
 * Action Creators
 * */

export const fetchSuppliers = () => ({
    type: FETCH_SUPPLIERS,
});

export const fetchSuppliersSuccess = suppliers => ({
    type:    FETCH_SUPPLIERS_SUCCESS,
    payload: suppliers,
});

export const createSupplier = supplier => ({
    type:    CREATE_SUPPLIER,
    payload: supplier,
});

export const createSupplierSuccess = suppliers => ({
    type:    CREATE_SUPPLIER_SUCCESS,
    payload: suppliers,
});

export const deleteSupplier = id => ({
    type:    DELETE_SUPPLIER,
    payload: id,
});

export const deleteSupplierSuccess = supplier => ({
    type:    DELETE_SUPPLIER_SUCCESS,
    payload: supplier,
});
