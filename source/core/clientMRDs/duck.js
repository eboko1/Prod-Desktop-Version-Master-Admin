/**
 * Constants
 * */
export const moduleName = 'clientMRDs';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENT_MRDS = `${prefix}/FETCH_CLIENT_MRDS`;
export const FETCH_CLIENT_MRDS_SUCCESS = `${prefix}/FETCH_CLIENT_MRDS_SUCCESS`;

export const SET_FILTER_DATE = `${prefix}/SET_FILTER_DATE`;

/**
 * Reducer
 * */

const ReducerState = {
    mrds: [],
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
            return {
                ...state,
                mrds: payload,
            };
        
        case SET_FILTER_DATE:
            return {
                ...state,
                filter:{
                    ...state.filter,
                    MRDsUntilDate: payload
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

export const fetchClientMRDsSuccess = clientMRDs => ({
    type:    FETCH_CLIENT_MRDS_SUCCESS,
    payload: clientMRDs,
});

export const setFilterDate = MRDDate => ({
    type: SET_FILTER_DATE,
    payload: MRDDate
});
