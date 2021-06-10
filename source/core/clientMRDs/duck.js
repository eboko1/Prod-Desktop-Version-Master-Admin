/**
 * Constants
 * */
export const moduleName = 'clientMRDs';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT_MRDS = `${prefix}/FETCH_CLIENT_MRDS`;
export const FETCH_CLIENT_MRDS_SUCCESS = `${prefix}/FETCH_CLIENT_MRDS_SUCCESS`;

export const FETCH_CASH_ORDER_ENTITY = `${prefix}/FETCH_CASH_ORDER_ENTITY`;
export const FETCH_CASH_ORDER_ENTITY_SUCCESS = `${prefix}/FETCH_CASH_ORDER_ENTITY_SUCCESS`;

export const SET_CLIENT_MRDS_PAGE = `${prefix}/SET_CLIENT_MRDS_PAGE`;
export const SET_CASH_ORDER_ENTITY_IS_FETCHING = `${prefix}/SET_CASH_ORDER_ENTITY_IS_FETCHING`;
export const SET_CASH_ORDER_MODAL_MOUNTED = `${prefix}/SET_CASH_ORDER_MODAL_MOUNTED`;
export const SET_FILTER_DATE = `${prefix}/SET_FILTER_DATE`;

/**
 * Reducer
 * */

const ReducerState = {
    mrds: [],
    stats: {},
    cashOrderEntity: {},
    cashOrderEntityIsFetching: false,
    cashOrderModalMounted: false,
    filter:     {
        page: 1,
        MRDsUntilDate: undefined
    },
    sort: {
        field: 'datetime',
        order: 'desc',
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case FETCH_CLIENT_MRDS_SUCCESS:
            const {mrds, stats} = payload;
            return {
                ...state,
                mrds: mrds? mrds: state.mrds,
                stats: stats? stats: state.stats
            };

        case FETCH_CASH_ORDER_ENTITY_SUCCESS:
            return {
                ...state,
                cashOrderEntity: payload,
                cashOrderEntityIsFetching: false
            };

        case FETCH_CASH_ORDER_ENTITY: 
            return {
                ...state,
                cashOrderEntityIsFetching: true
            };
        
        case SET_FILTER_DATE:
            return {
                ...state,
                filter:{
                    ...state.filter,
                    MRDsUntilDate: payload
                }
            };

        case SET_CLIENT_MRDS_PAGE: 
            return {
                ...state,
                filter:{
                    ...state.filter,
                    page: payload
                }
            };
        
        case SET_CASH_ORDER_MODAL_MOUNTED:
            return {
                ...state,
                cashOrderModalMounted: payload
            };

        case SET_CASH_ORDER_ENTITY_IS_FETCHING:
            return {
                ...state,
                cashOrderEntityIsFetching: payload
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

export const stateSelector = state => state[ moduleName ];
export const selectClientMRDsStats = state => state[ moduleName ].stats;


export const fetchClientMRDs = ({clientId}) => ({ 
    type:    FETCH_CLIENT_MRDS,
    payload: { clientId },
});

export const fetchClientMRDsSuccess = ({mrds, stats}) => ({
    type:    FETCH_CLIENT_MRDS_SUCCESS,
    payload: {mrds, stats},
});

export const fetchCashOrderEntity = (cashOrderId) => ({ 
    type:    FETCH_CASH_ORDER_ENTITY,
    payload: cashOrderId,
});

export const fetchCashOrderEntitySuccess = (cashOrderEntity) => ({
    type:    FETCH_CASH_ORDER_ENTITY_SUCCESS,
    payload: cashOrderEntity,
});

export const setClientMRDsPage = (page) => ({ 
    type:    SET_CLIENT_MRDS_PAGE,
    payload: page
});

export const setFilterDate = MRDDate => ({
    type: SET_FILTER_DATE,
    payload: MRDDate
});

export const setCashOrderEntityIsFetching = cashOrderEntityIsFetching => ({
    type: SET_CASH_ORDER_ENTITY_IS_FETCHING,
    payload: cashOrderEntityIsFetching
});

// export const setCashOrderEntityIsFetching = cashOrderEntityIsFetching => {
//     return (dispatch, getState) => {
//         dispatch(setCashOrderEntityIsFetchingX(cashOrderEntityIsFetching))
//     }
// };

export const setCashOrderModalMounted = (isCashOrderModalMounted) => ({ 
    type:    SET_CASH_ORDER_MODAL_MOUNTED,
    payload: isCashOrderModalMounted
});