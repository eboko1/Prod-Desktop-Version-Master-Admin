import _ from 'lodash';

/**
 * Constants
 * */
export const moduleName = 'tecDoc';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_TEC_DOC_FORM = `${prefix}/ON_CHANGE_TEC_DOC_FORM`;

export const FETCH_SECTIONS = `${prefix}/FETCH_SECTIONS`;
export const FETCH_SECTIONS_SUCCESS = `${prefix}/FETCH_SECTIONS_SUCCESS`;

export const FETCH_PARTS = `${prefix}/FETCH_PARTS`;
export const FETCH_PARTS_SUCCESS = `${prefix}/FETCH_PARTS_SUCCESS`;

export const FETCH_CROSSES = `${prefix}/FETCH_CROSSES`;
export const FETCH_CROSSES_SUCCESS = `${prefix}/FETCH_CROSSES_SUCCESS`;

export const FETCH_ATTRIBUTES = `${prefix}/FETCH_ATTRIBUTES`;
export const FETCH_ATTRIBUTES_SUCCESS = `${prefix}/FETCH_ATTRIBUTES_SUCCESS`;

export const CLEAR_ATTRIBUTES = `${prefix}/CLEAR_ATTRIBUTES`;

/**
 * Reducer
 * */

const ReducerState = {
    fields:     {},
    sections:   [],
    parts:      [],
    crossesMap: {},
    attributes: null,
};

const mergeSections = (oldSections, level, additionalSections) => {
    const sLevel = String(level);

    if (sLevel === '0') {
        return additionalSections;
    }

    function customizer(level, objValue, srcValue) {
        const updatedValue = _.cloneDeep(objValue);

        if (String(updatedValue.id) === String(level)) {
            updatedValue.children = srcValue;
        } else if (updatedValue.children) {
            updatedValue.children = updatedValue.children.map(os =>
                customizer(level, os, additionalSections));
        }

        return updatedValue;
    }

    return oldSections.map(os => customizer(level, os, additionalSections));
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case ON_CHANGE_TEC_DOC_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        case FETCH_SECTIONS_SUCCESS:
            return {
                ...state,
                sections: mergeSections(
                    state.sections,
                    payload.level,
                    payload.sections,
                ),
            };

        case FETCH_PARTS:
            return {
                ...state,
                parts: [],
            };

        case FETCH_PARTS_SUCCESS:
            return {
                ...state,
                parts: payload,
            };

        case FETCH_ATTRIBUTES_SUCCESS:
            return {
                ...state,
                attributes: payload,
            };

        case CLEAR_ATTRIBUTES:
            return {
                ...state,
                attributes: null,
            };

        case FETCH_CROSSES_SUCCESS:
            return {
                ...state,
                crossesMap: {
                    ...state.crossesMap,
                    [ payload.number ]: payload.parts,
                },
            };
        default:
            return state;
    }
}

export const onChangeTecDocForm = update => ({
    type:    ON_CHANGE_TEC_DOC_FORM,
    payload: update,
});

export const fetchSections = (level, modification) => ({
    type:    FETCH_SECTIONS,
    payload: { level, modification },
});

export const fetchSectionsSuccess = (level, sections) => ({
    type:    FETCH_SECTIONS_SUCCESS,
    payload: { level, sections },
});

export const fetchParts = (modificationId, id) => ({
    type:    FETCH_PARTS,
    payload: { modificationId, id },
});

export const fetchPartsSuccess = parts => ({
    type:    FETCH_PARTS_SUCCESS,
    payload: parts,
});

export const fetchCrosses = number => ({
    type:    FETCH_CROSSES,
    payload: number,
});

export const fetchCrossesSuccess = (number, parts) => ({
    type:    FETCH_CROSSES_SUCCESS,
    payload: { number, parts },
});

export const fetchAttributes = (partNumber, supplierId) => ({
    type:    FETCH_ATTRIBUTES,
    payload: { partNumber, supplierId },
});

export const fetchAttributesSuccess = attributes => ({
    type:    FETCH_ATTRIBUTES_SUCCESS,
    payload: attributes,
});

export const clearAttributes = () => ({
    type: CLEAR_ATTRIBUTES,
});
