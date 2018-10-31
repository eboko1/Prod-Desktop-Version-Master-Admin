/**
 * Constants
 * */
export const moduleName = 'tecDocActions';
const prefix = `cpb/${moduleName}`;

export const FETCH_PART_ATTRIBUTES = `${prefix}/FETCH_PART_ATTRIBUTES`;
export const FETCH_PART_ATTRIBUTES_SUCCESS = `${prefix}/FETCH_PART_ATTRIBUTES_SUCCESS`;
export const CLEAR_PART_ATTRIBUTES = `${prefix}/CLEAR_PART_ATTRIBUTES`;

export const FETCH_SUGGESTION_PARTS = `${prefix}/FETCH_SUGGESTION_PARTS`;
export const FETCH_SUGGESTION_PARTS_SUCCESS = `${prefix}/FETCH_SUGGESTION_PARTS_SUCCESS`;
export const CLEAR_SUGGESTION_PARTS = `${prefix}/CLEAR_SUGGESTION_PARTS`;

export const FETCH_CROSS_PARTS = `${prefix}/FETCH_CROSS_PARTS`;
export const FETCH_CROSS_PARTS_SUCCESS = `${prefix}/FETCH_CROSS_PARTS_SUCCESS`;
export const CLEAR_CROSS_PARTS = `${prefix}/CLEAR_CROSS_PARTS`;

export const SET_OPERATION_INDEX = `${prefix}/SET_OPERATION_INDEX`;

/**
 * Reducer
 * */

const ReducerState = {
    operationIndex:      null,
    attributes:          [],
    suggestions:         [],
    crosses:             [],
    selectedAttributes:  null,
    selectedSuggestions: null,
    selectedCrosses:     null,
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_PART_ATTRIBUTES_SUCCESS:
            return {
                ...state,
                attributes:         [ ...state.attributes, payload ],
                selectedAttributes: {
                    partCode:   payload.partCode,
                    supplierId: payload.supplierId,
                },
            };

        case CLEAR_PART_ATTRIBUTES:
            return {
                ...state,
                selectedAttributes: null,
            };

        case FETCH_SUGGESTION_PARTS_SUCCESS:
            return {
                ...state,
                suggestions:         [ ...state.suggestions, payload ],
                selectedSuggestions: {
                    productId:      payload.productId,
                    modificationId: payload.modificationId,
                },
            };
        case CLEAR_SUGGESTION_PARTS:
            return {
                ...state,
                selectedSuggestions: null,
            };

        case FETCH_CROSS_PARTS_SUCCESS:
            return {
                ...state,
                crosses:         [ ...state.crosses, payload ],
                selectedCrosses: {
                    productId:      payload.productId,
                    modificationId: payload.modificationId,
                },
            };
        case CLEAR_CROSS_PARTS:
            return {
                ...state,
                selectedCrosses: null,
            };

        case SET_OPERATION_INDEX:
            return {
                ...state,
                operationIndex: payload,
            };

        default:
            return state;
    }
}

export const fetchPartAttributes = (partCode, supplierId) => ({
    type:    FETCH_PART_ATTRIBUTES,
    payload: { partCode, supplierId },
});

export const fetchSuggestionParts = (productId, modificationId) => ({
    type:    FETCH_SUGGESTION_PARTS,
    payload: { productId, modificationId },
});

export const fetchCrossParts = (productId, modificationId) => ({
    type:    FETCH_CROSS_PARTS,
    payload: { productId, modificationId },
});

export const fetchPartAttributesSuccess = (
    partCode,
    supplierId,
    { attributes, images },
) => ({
    type:    FETCH_PART_ATTRIBUTES_SUCCESS,
    payload: { partCode, supplierId, attributes, images },
});

export const fetchSuggestionPartsSuccess = (
    productId,
    modificationId,
    suggestions,
) => ({
    type:    FETCH_SUGGESTION_PARTS_SUCCESS,
    payload: { productId, modificationId, suggestions },
});

export const fetchCrossPartsSuccess = (productId, modificationId, crosses) => ({
    type:    FETCH_CROSS_PARTS_SUCCESS,
    payload: { productId, modificationId, crosses },
});

export const clearPartAttributes = () => ({
    type: CLEAR_PART_ATTRIBUTES,
});

export const clearSuggestionParts = () => ({
    type: CLEAR_SUGGESTION_PARTS,
});

export const clearCrossParts = () => ({
    type: CLEAR_CROSS_PARTS,
});

export const setOperationIndex = operationIndex => ({
    type:    SET_OPERATION_INDEX,
    payload: operationIndex,
});
