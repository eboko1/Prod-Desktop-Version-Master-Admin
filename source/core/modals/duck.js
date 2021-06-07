/* Constants */
export const moduleName = 'modals';
const prefix = `cpb/${moduleName}`;

export const SET_MODAL = `${prefix}/SET_MODAL`;
export const RESET_MODAL = `${prefix}/RESET_MODAL`;
export const SAVE_MODAL = `${prefix}/SAVE_MODAL`;
export const LOAD_MODAL = `${prefix}/LOAD_MODAL`;

/**
 * All the modals that are available to call. Each have to check if it is visible by tracking its contant
 */
export const MODALS = {
    ADD_CLIENT:             'ADD_CLIENT',
    ADD_CASHBOX:            'ADD_CASHBOX',
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
    STORE_PRODUCT:          'STORE_PRODUCT',
    SERVICE_INPUT:          'SERVICE_INPUT',
    SERVICE_OUTPUT:         'SERVICE_OUTPUT',
    VEHICLE:                'VEHICLE',
    
    //Report modals
    REPORT_ORDERS_FILTER:   'REPORT_ORDERS_FILTER',
    REPORT_ORDERS_EXPORT:   'REPORT_ORDERS_EXPORT',
    REPORT_ANALYTICS:       'REPORT_ANALYTICS',
    
    //Common modals
    CONFIRM:                'CONFIRM',
    
    ADD_LABOR_OR_DETAIL_TO_ORDER: 'ADD_LABOR_OR_DETAIL_TO_ORDER',
};

/* Reducer */
const ReducerState = {
    modal:      '', // Currently active modal
    modalProps: {}, // Props of a current modal
    modals: {} // Old modals props: MODAL_NAME: {...modal_props...}
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
        
        case SAVE_MODAL:
            //Get current modal's data
            const currentModal = state.modal;
            const currentModalProps = state.modalProps;

            //Save current modal's data with its name as a key
            return {
                ...state,
                modals: {
                    ...state.modals,
                    [ currentModal ]: currentModalProps,
                }
            };

        case LOAD_MODAL:
            const { modal, modalProps } = payload;
            const oldModalProps = state.modals[modal] || {};

            return {
                state,
                modal: modal,
                modalProps: {...oldModalProps, ...modalProps}, //Place old props and replace with provided ones
                modals: {
                    ...state.modlas,
                    [modal]: undefined, //Remove old data
                }
            };
        
        default:
            return state;
    }
}

/* Selectors */
export const stateSelector = state => state[ moduleName ];
export const selectModal = state => stateSelector(state).modal;
export const selectModalProps = state => stateSelector(state).modalProps;

/* Action Creators */

/**
 * Set a new provided modal with provided props.
 * To get modal's props use apropriate selector
 * @param {String} modal      Modal you wnat to set as "currently active"
 * @param {Object} [ modalProps ] Modal's props
 */
export const setModal = (modal, modalProps) => ({
    type:    SET_MODAL,
    payload: { modal, modalProps },
});

/**
 * Remove currently active modal
 */
export const resetModal = () => ({
    type:    RESET_MODAL,
});

/**
 * Save currently active modal into special object and reset current modal.
 * To get your modal back call loadModal action and provide its name and new props if needed.
 */
export const saveModal = () => {
    return function(dispatch) {
        dispatch({
            type:    SAVE_MODAL,
        });

        dispatch(resetModal());
    }
};

/**
 * Opens a modal and loads its saved modalProps.
 * If you provide new modal props, old will be overwriten and data of old modalProps will be lost.
 * 
 * @param {String} modal      Modal you want to load
 * @param {Object} modalProps Additional modal props(will overwrite old, {...old, ...new})
 */
export const loadModal = (modal, modalProps = {}) => ({
    type: LOAD_MODAL,
    payload: { modal, modalProps }
});