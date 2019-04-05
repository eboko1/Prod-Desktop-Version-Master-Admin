//
// Constants
//
export const moduleName = 'modals';
const prefix = `cpb/${moduleName}`;

export const SET_MODAL = `${prefix}/SET_MODAL`;
export const RESET_MODAL = `${prefix}/RESET_MODAL`;

export const MODALS = {
    ADD_CLIENT:             'ADD_CLIENT',
    CANCEL_REASON:          'CANCEL_REASON',
    CASH_ORDER:             'CASH_ORDER',
    CHANGE_TASK:            'CHANGE_TASK',
    CONFIRM_EXIT:           'CONFIRM_EXIT',
    CONFIRM_RESCHEDULE:     'CONFIRM_RESCHEDULE',
    DETAIL_PRODUCT:         'DETAIL_PRODUCT',
    INVITE:                 'INVITE',
    ORDER_TASK:             'ORDER_TASK',
    SPREAD_BUSINESS_BRANDS: 'SPREAD_BUSINESS_BRANDS',
    SUBSCRIBE:              'SUBSCRIBE',
    SUPPLIER:               'SUPPLIER',
    SWITCH_BUSINESS:        'SWITCH_BUSINESS',
    TO_SUCCESS:             'TO_SUCCESS',
    UNIVERSAL_CHART:        'UNIVERSAL_CHART',
    UNIVERSAL_FILTERS:      'UNIVERSAL_FILTERS',
    PDF_VIEWER:             'PDF_VIEWER',
    STORE_GROUP:            'STORE_GROUP',
<<<<<<< HEAD
    STORE_PRODUCT:          'STORE_PRODUCT',
=======
    STORE_PRODUCT_GROUP:    'STORE_PRODUCT_GROUP',
>>>>>>> fef1b4c0f25fe73484fd954f31b415c010ed55c6
};

//
// Reducer
//
const ReducerState = {
    modal:      '',
    modalProps: {},
};

export default function popupsReducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_MODAL:
            return {
                ...state,
                modal:      payload.modal,
                modalProps: payload.modalProps,
            };
        case RESET_MODAL:
            return {
                ...state,
                modal:      payload,
                modalProps: {},
            };
        default:
            return state;
    }
}
//
// Action Creators
//
export const setModal = (modal, modalProps) => ({
    type:    SET_MODAL,
    payload: { modal, modalProps },
});

export const resetModal = () => ({
    type:    RESET_MODAL,
    payload: '',
});
