//
// Constants
//
export const moduleName = 'modals';
const prefix = `cpb/${moduleName}`;

export const SET_MODAL = `${prefix}/SET_MODAL`;
export const RESET_MODAL = `${prefix}/RESET_MODAL`;

export const MODALS = {
    ADD_CLIENT:        'ADD_CLIENT',
    INVITE:            'INVITE',
    UNIVERSAL_FILTERS: 'UNIVERSAL_FILTERS',
    CANCEL_REASON:     'CANCEL_REASON',
    TO_SUCCESS:        'TO_SUCCESS',
    CONFIRM_EXIT:      'CONFIRM_EXIT',
};

//
// Reducer
//
const ReducerState = {
    modal: '',
};

export default function popupsReducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_MODAL:
            return {
                ...state,
                modal: payload,
            };
        case RESET_MODAL:
            return {
                ...state,
                modal: payload,
            };
        default:
            return state;
    }
}
//
// Action Creators
//
export const setModal = modal => ({
    type:    SET_MODAL,
    payload: modal,
});

export const resetModal = () => ({
    type:    RESET_MODAL,
    payload: '',
});
