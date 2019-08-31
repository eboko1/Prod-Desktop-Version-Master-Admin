// vendor
import { call, put, all, take } from 'redux-saga/effects';
import nprogress from 'nprogress';
import { createSelector } from 'reselect';
import _ from 'lodash';

//proj
import { emitError } from 'core/ui/duck';
import { fetchAPI } from 'utils';
/**
 * Constants
 **/

export const moduleName = 'store_groups';
const prefix = `cpb/${moduleName}`;

export const FETCH_STORE_GROUPS = `${prefix}/FETCH_STORE_GROUPS`;
export const FETCH_STORE_GROUPS_SUCCESS = `${prefix}/FETCH_STORE_GROUPS_SUCCESS`;

export const CREATE_STORE_GROUP = `${prefix}/CREATE_STORE_GROUP`;
export const CREATE_STORE_GROUP_SUCCESS = `${prefix}/CREATE_STORE_GROUP_SUCCESS`;
export const UPDATE_STORE_GROUP = `${prefix}/UPDATE_STORE_GROUP`;
export const UPDATE_STORE_GROUP_SUCCESS = `${prefix}/UPDATE_STORE_GROUP_SUCCESS`;
export const DELETE_STORE_GROUP = `${prefix}/DELETE_STORE_GROUP`;
export const DELETE_STORE_GROUP_SUCCESS = `${prefix}/DELETE_STORE_GROUP_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    storeGroups: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_STORE_GROUPS_SUCCESS:
            return { ...state, storeGroups: payload };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state.storage[ moduleName ];
export const selectStoreGroups = state => stateSelector(state).storeGroups;

export const selectFlattenStoreGroups = createSelector(
    [ stateSelector ],
    ({ storeGroups }) => {
        const flattenTree = [];
        const flattenStoreGroups = data => {
            for (let item = 0; item < data.length; item++) {
                const node = data[ item ];

                flattenTree.push({
                    id:   node.id,
                    name: node.name,
                });
                if (node.childGroups) {
                    flattenStoreGroups(node.childGroups);
                }
            }
        };
        flattenStoreGroups(storeGroups);

        return flattenTree;
    },
);

// export const selectStoreGroups = createSelector(
//     [ stateSelector ],
//     ({ storeGroups }) => {
//         const generateTreeNode = tree =>
//             tree.map(node => {
//                 return {
//                     businessId:    node.businessId,
//                     languageId:    node.languageId,
//                     parentGroupId: node.parentGroupId,
//                     title:         node.name,
//                     key:           node.id,
//                     id:            node.id,
//                     children:      _.isEmpty(node.childGroups)
//                         ? node.childGroups
//                         : generateTreeNode(node.childGroups),
//                 };
//             });

//         return !_.isEmpty(storeGroups) ? generateTreeNode(storeGroups) : [];
//     },
// );

/**
 * Action Creators
 **/

// storeGroups
export const fetchStoreGroups = () => ({
    type: FETCH_STORE_GROUPS,
});

export const fetchStoreGroupsSuccess = storeGroups => ({
    type:    FETCH_STORE_GROUPS_SUCCESS,
    payload: storeGroups,
});

export const createStoreGroup = storeGroup => ({
    type:    CREATE_STORE_GROUP,
    payload: storeGroup,
});

export const createStoreGroupSuccess = () => ({
    type: CREATE_STORE_GROUP_SUCCESS,
});

export const updateStoreGroup = storeGroup => ({
    type:    UPDATE_STORE_GROUP,
    payload: storeGroup,
});

export const updateStoreGroupSuccess = () => ({
    type: UPDATE_STORE_GROUP_SUCCESS,
});

export const deleteStoreGroup = storeGroup => ({
    type:    DELETE_STORE_GROUP,
    payload: storeGroup,
});

export const deleteStoreGroupSuccess = () => ({
    type: DELETE_STORE_GROUP_SUCCESS,
});

/**
 * Sagas
 **/

export function* fetchStoreGroupsSaga() {
    while (true) {
        try {
            yield take(FETCH_STORE_GROUPS);
            yield nprogress.start();

            const storeGroups = yield call(fetchAPI, 'GET', 'store_groups');

            yield put(fetchStoreGroupsSuccess(storeGroups));
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* createStoreGroupSaga() {
    while (true) {
        try {
            const { payload } = yield take(CREATE_STORE_GROUP);
            yield nprogress.start();
            const storeGroups = yield call(
                fetchAPI,
                'POST',
                'store_groups',
                null,
                payload,
            );

            yield put(createStoreGroupSuccess(storeGroups));
            yield put(fetchStoreGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* updateStoreGroupSaga() {
    while (true) {
        try {
            const { payload } = yield take(UPDATE_STORE_GROUP);
            yield nprogress.start();
            yield call(
                fetchAPI,
                'PUT',
                `store_groups/${payload.id}`,
                null,
                _.omit(payload, [ 'id', 'parentGroupId' ]),
            );

            yield put(updateStoreGroupSuccess());
            yield put(fetchStoreGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* deleteStoreGroupSaga() {
    while (true) {
        try {
            const { payload: id } = yield take(DELETE_STORE_GROUP);
            yield nprogress.start();

            yield call(fetchAPI, 'DELETE', `store_groups/${id}`);

            yield put(deleteStoreGroupSuccess());
            yield put(fetchStoreGroups());
        } catch (error) {
            yield put(emitError(error));
        } finally {
            yield nprogress.done();
        }
    }
}

export function* saga() {
    yield all([
        call(fetchStoreGroupsSaga),
        call(createStoreGroupSaga),
        call(updateStoreGroupSaga),
        call(deleteStoreGroupSaga),
    ]);
}
