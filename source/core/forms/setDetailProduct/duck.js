import _ from 'lodash';

/**
 * Constants
 * */

export const moduleName = 'setDetailProductForm';
const prefix = `cpb/${moduleName}`;

export const FETCH_DETAILS = `${prefix}/FETCH_DETAILS`;
export const FETCH_DETAILS_SUCCESS = `${prefix}/FETCH_DETAILS_SUCCESS`;

export const ON_CHANGE_SET_DETAIL_PRODUCT_FORM = `${prefix}/ON_CHANGE_SET_DETAIL_PRODUCT_FORM`;

export const FETCH_PRODUCT_NAMES = `${prefix}/FETCH_PRODUCT_NAMES`;
export const FETCH_PRODUCT_NAMES_SUCCESS = `${prefix}/FETCH_PRODUCT_NAMES_SUCCESS`;

export const SUBMIT_DETAIL_PRODUCT = `${prefix}/SUBMIT_DETAIL_PRODUCT`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:   {},
    details:  null,
    brands:   null,
    products: null,
    configs:  null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_SET_DETAIL_PRODUCT_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_DETAILS_SUCCESS:
            return {
                ...state,
                details: _.chain(payload.details)
                    .filter(Boolean)
                    .map(detail => ({
                        ...detail,
                        ..._.find(payload.products, {
                            id: detail.productId,
                        }) || {},
                    }))
                    .map(detail => ({
                        detailId:   detail.detailId,
                        detailName: detail.productName
                            ? `${detail.detailName} - «${detail.productName}»`
                            : detail.detailName,
                    }))
                    .value(),
                brands: _.filter(payload.brands, 'supplierId'),
            };

        case FETCH_PRODUCT_NAMES_SUCCESS:
            return {
                ...state,
                products: payload,
            };

        case SUBMIT_DETAIL_PRODUCT:
            return {
                ...state,
                fields:   {},
                products: null,
                details:  null,
                brands:   null,
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const submitDetailProduct = (detailId, productId) => ({
    type:    SUBMIT_DETAIL_PRODUCT,
    payload: { detailId, productId },
});

export const fetchDetails = () => ({
    type: FETCH_DETAILS,
});

export const fetchDetailsSuccess = orderFormData => ({
    type:    FETCH_DETAILS_SUCCESS,
    payload: orderFormData,
});

export const fetchProductNames = (articleNumber, supplierId) => ({
    type:    FETCH_PRODUCT_NAMES,
    payload: { articleNumber, supplierId },
});

export const fetchProductNamesSuccess = products => ({
    type:    FETCH_PRODUCT_NAMES_SUCCESS,
    payload: products,
});

export const onChangeSetDetailProductForm = fields => ({
    type:    ON_CHANGE_SET_DETAIL_PRODUCT_FORM,
    payload: fields,
});
