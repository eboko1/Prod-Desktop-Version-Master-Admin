// vendor
import { call, put, all, take } from 'redux-saga/effects';

//proj
import { fetchAPI } from 'utils';

// own
import {
    fetchSectionsSuccess,
    fetchPartsSuccess,
    fetchCrossesSuccess,
    fetchAttributesSuccess,
    FETCH_SECTIONS,
    FETCH_PARTS,
    FETCH_CROSSES,
    FETCH_ATTRIBUTES,
} from './duck';

export function* fetchCrossesSaga() {
    while (true) {
        const { payload: number } = yield take(FETCH_CROSSES);

        const query = {
            number,
            key: 'test',
            act: 'getCrosses',
        };

        const data = yield call(fetchAPI, 'GET', 'api.php', query, void 0, {
            url:     'https://partsapi.ru/',
            noAuth:  true,
            headers: {},
        });

        yield put(fetchCrossesSuccess(number, data));
    }
}

export function* fetchAttributesSaga() {
    while (true) {
        const {
            payload: { partNumber, supplierId },
        } = yield take(FETCH_ATTRIBUTES);

        const query = { partNumber, supplierId };

        const data = yield call(
            fetchAPI,
            'GET',
            'tecdoc/attributes',
            query,
            void 0,
        );

        yield put(fetchAttributesSuccess(data));
    }
}

export function* fetchPartsSaga() {
    while (true) {
        const {
            payload: { id, modificationId },
        } = yield take(FETCH_PARTS);

        const query = {
            modificationId,
            sectionId: id,
        };

        const data = yield call(
            fetchAPI,
            'GET',
            'tecdoc/sections/parts',
            query,
            void 0,
        );

        yield put(fetchPartsSuccess(data));
    }
}

export function* fetchSectionsSaga() {
    while (true) {
        const {
            payload: { level, modification },
        } = yield take(FETCH_SECTIONS);

        const query = {
            modificationId: modification,
            level,
        };

        const data = yield call(fetchAPI, 'GET', 'tecdoc/sections', query);

        yield put(fetchSectionsSuccess(level, data));
    }
}

export function* saga() {
    yield all([
        call(fetchSectionsSaga),
        call(fetchPartsSaga),
        call(fetchCrossesSaga),
        call(fetchAttributesSaga),
    ]);
}
