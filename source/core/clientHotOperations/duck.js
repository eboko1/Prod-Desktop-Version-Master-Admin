/**
 * Constants
 * */
export const moduleName = 'clientHotOperations';
const prefix = `cpb/${moduleName}`;

export const FETCH_CLIENTS = `${prefix}/FETCH_CLIENTS`;
export const FETCH_CLIENTS_SUCCESS = `${prefix}/FETCH_CLIENTS_SUCCESS`;


/**
 * Reducer
 * */

const ReducerState = {
    clients: [],
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {

        case FETCH_CLIENTS_SUCCESS:
            const {clients} = payload;
            return {
                ...state,
                clients: clients
            };

        default:
            return state;
    }
}

export const fetchClients = () => ({
    type: FETCH_CLIENTS
});

export const fetchClientsSuccess = ({clients}) => ({
    type: FETCH_CLIENTS_SUCCESS,
    payload: {clients}
});