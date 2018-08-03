/* eslint-disable comma-dangle */
/**
 * Constants
 * */
export const moduleName = 'mobileRecordForm';
const prefix = `cpb/${moduleName}`;

export const ON_CHANGE_MOBILE_RECORD_FORM = `${prefix}/ON_CHANGE_MOBILE_RECORD_FORM`;

/**
 * Reducer
 * */
//

const ReducerState = {
    fields: {
        client: {
            errors:     void 0,
            name:       'make',
            touched:    true,
            validating: false,
            value:      void 0,
            dirty:      false,
        },
        vehicle: {
            errors:     void 0,
            name:       'models',
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
        case ON_CHANGE_MOBILE_RECORD_FORM:
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

export const stateSelector = state => state[ moduleName ];

/**
 * Action Creators
 * */

export const onChangeMobileRecordForm = update => ({
    type:    ON_CHANGE_MOBILE_RECORD_FORM,
    payload: update,
});
