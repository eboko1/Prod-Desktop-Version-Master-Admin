/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'toSuccessForm';
const prefix = `cpb/${moduleName}`;

// export const FETCH_TO_SUCCESS_FORM = `${prefix}/FETCH_TO_SUCCESS_FORM`;
// export const FETCH_TO_SUCCESS_FORM_SUCCESS = `${prefix}/FETCH_TO_SUCCESS_FORM_SUCCESS`;

export const ON_CHANGE_TO_SUCCESS_FORM = `${prefix}/ON_CHANGE_TO_SUCCESS_FORM`;

/**
 * Reducer
 **/

const ReducerState = {
    fields: {
        toSuccess: {
            errors:     void 0,
            name:       'toSuccess',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        sms: {
            errors:     void 0,
            name:       'sms',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
    },
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        // case FETCH_TO_SUCCESS_FORM_SUCCESS:
        //     return {
        //         ...state,
        //         ...payload,
        //     };

        case ON_CHANGE_TO_SUCCESS_FORM:
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

// export const fetchToSuccessForm = () => ({
//     type: FETCH_TO_SUCCESS_FORM,
// });

// export const fetchToSuccessFormSuccess = filters => ({
//     type:    FETCH_TO_SUCCESS_FORM_SUCCESS,
//     payload: filters,
// });

export const onChangeToSuccessForm = update => ({
    type:    ON_CHANGE_TO_SUCCESS_FORM,
    payload: update,
});
