/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'cancelReasonForm';
const prefix = `cpb/${moduleName}`;

// export const FETCH_CANCEL_REASON_FORM = `${prefix}/FETCH_CANCEL_REASON_FORM`;
// export const FETCH_CANCEL_REASON_FORM_SUCCESS = `${prefix}/FETCH_CANCEL_REASON_FORM_SUCCESS`;

export const ON_CHANGE_CANCEL_REASON_FORM = `${prefix}/ON_CHANGE_CANCEL_REASON_FORM`;

/**
 * Reducer
 * */
//

const ReducerState = {
    fields: {
        cancelReason: {
            errors:     void 0,
            name:       'cancelReason',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        cancelComment: {
            errors:     void 0,
            name:       'cancelComment',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload, meta } = action;

    switch (type) {
        // case FETCH_CANCEL_REASON_FORM_SUCCESS:
        //     return {
        //         ...state,
        //         ...payload,
        //     };

        case ON_CHANGE_CANCEL_REASON_FORM:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...payload,
                },
            };

        default:
            return state;
    }
}

/**
 * Selectors
 * */

// export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

// export const fetchCancelReasonForm = () => ({
//     type: FETCH_CANCEL_REASON_FORM,
// });

// export const fetchCancelReasonFormSuccess = filters => ({
//     type:    FETCH_CANCEL_REASON_FORM_SUCCESS,
//     payload: filters,
// });

export const onChangeCancelReasonForm = update => ({
    type:    ON_CHANGE_CANCEL_REASON_FORM,
    payload: update,
});
