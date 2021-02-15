/**
 * Constants
 **/

export const moduleName = 'warehouses';
const prefix = `cpb/${moduleName}`;

export const FETCH_WAREHOUSES = `${prefix}/FETCH_WAREHOUSES`;
export const FETCH_WAREHOUSES_SUCCESS = `${prefix}/FETCH_WAREHOUSES_SUCCESS`;

/**
 * Reducer
 **/

const ReducerState = {
    warehouses: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;
    switch (type) {
        case FETCH_WAREHOUSES_SUCCESS:
            return { 
                ...state, 
                warehouses: payload 
            };

        default:
            return state;
    }
}

/**
 * Selectors
 **/

export const stateSelector = state => state[ moduleName ];
export const selectWarehouses = state => state[ moduleName ].warehouses;

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

export const fetchWarehouses = () => ({
    type: FETCH_WAREHOUSES,
});

export const fetchWarehousesSuccess = warehouses => ({
    type:    FETCH_WAREHOUSES_SUCCESS,
    payload: warehouses,
});
