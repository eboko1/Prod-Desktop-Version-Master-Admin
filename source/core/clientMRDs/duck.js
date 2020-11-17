/**
 * Constants
 * */
export const moduleName = 'clientMRDs';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT_MRDS = `${prefix}/FETCH_CLIENT_MRDS`;
export const FETCH_CLIENT_MRDS_SUCCESS = `${prefix}/FETCH_CLIENT_MRDS_SUCCESS`;

export const SET_CLIENT_MRDS_PAGE = `${prefix}/SET_CLIENT_MRDS_PAGE`;

export const SET_FILTER_DATE = `${prefix}/SET_FILTER_DATE`;

/**
 * Reducer
 * */

const ReducerState = {
    mrds: [],
    stats: {},
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

        default:
            return state;
    }
}


export const fetchClientMRDs = ({clientId}) => ({ 
    type:    FETCH_CLIENT_MRDS,
    payload: { clientId },
});

export const fetchClientMRDsSuccess = ({mrds, stats}) => ({
    type:    FETCH_CLIENT_MRDS_SUCCESS,
    payload: {mrds, stats},
});

export const setClientMRDsPage = (page) => ({ 
    type:    SET_CLIENT_MRDS_PAGE,
    payload: page
});

export const setFilterDate = MRDDate => ({
    type: SET_FILTER_DATE,
    payload: MRDDate
});
