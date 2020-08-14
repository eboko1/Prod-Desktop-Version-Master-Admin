// vendor
import { call, put, all, take, select } from 'redux-saga/effects';
import _ from 'lodash';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchPartAttributesSuccess,
    fetchSuggestionPartsSuccess,
    fetchCrossPartsSuccess,
} from './duck';
import {
    FETCH_PART_ATTRIBUTES,
    FETCH_SUGGESTION_PARTS,
    FETCH_CROSS_PARTS,
} from './duck';

const selectAttributes = state => state.tecDocActions.attributes;
const selectSuggestions = state => state.tecDocActions.suggestions;
const selectCrosses = state => state.tecDocActions.crosses;

export function* fetchPartAttributesSaga() {
    while (true) {
        const {
            payload: { supplierId, partCode: partNumber },
        } = yield take(FETCH_PART_ATTRIBUTES);

        const query = { partNumber, supplierId };
        const findQuery = { partCode: partNumber, supplierId };

        const allAttributes = yield select(selectAttributes);
        let attributes = _.chain(allAttributes)
            .find(findQuery)
            .get('attributes')
            .value();
        if (!attributes) {
            attributes = yield call(
                fetchAPI,
                'GET',
                'tecdoc/attributes',
                query,
                void 0,
            );
        }

        yield put(
            fetchPartAttributesSuccess(partNumber, supplierId, attributes),
        );
    }
}

export function* fetchSuggestionPartsSaga() {
    while (true) {
        const {
            payload: { productId, modificationId },
        } = yield take(FETCH_SUGGESTION_PARTS);

        const query = { productId, modificationId };
        const allSuggestions = yield select(selectSuggestions);
        let suggestions = _.chain(allSuggestions)
            .find(query)
            .get('suggestions')
            .value();

        if (!suggestions) {
            suggestions = yield call(
                fetchAPI,
                'GET',
                'tecdoc/products/parts/suggest',
                query,
                void 0,
            );
        }

        yield put(
            fetchSuggestionPartsSuccess(productId, modificationId, suggestions),
        );
    }
}

export function* fetchCrossPartsSaga() {
    while (true) {
        const {
            payload: { productId, modificationId },
        } = yield take(FETCH_CROSS_PARTS);

        const query = { productId, modificationId };
        const allCrosses = yield select(selectCrosses);
        let crosses = _.chain(allCrosses)
            .find(query)
            .get('crosses')
            .value();

        if (!crosses) {
            crosses = yield call(
                fetchAPI,
                'GET',
                'tecdoc/products/parts',
                query,
                void 0,
            );
        }

        yield put(fetchCrossPartsSuccess(productId, modificationId, crosses));
    }
}

export function* saga() {
    yield all([ call(fetchPartAttributesSaga), call(fetchSuggestionPartsSaga), call(fetchCrossPartsSaga) ]);
}
