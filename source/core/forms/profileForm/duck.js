/**
 * Constants
 * */
export const moduleName = 'profileForm';
const prefix = `cpb/${moduleName}`;

// export const FETCH_PROFILE_FORM = `${prefix}/FETCH_PROFILE_FORM`;
// export const FETCH_PROFILE_FORM_SUCCESS = `${prefix}/FETCH_PROFILE_FORM_SUCCESS`;

export const SUBMIT_PROFILE_FORM = `${prefix}/SUBMIT_PROFILE_FORM`;
export const SUBMIT_PROFILE_FORM_SUCCESS = `${prefix}/SUBMIT_PROFILE_FORM_SUCCESS`;

export const ON_CHANGE_PROFILE_FORM = `${prefix}/ON_CHANGE_PROFILE_FORM`;

/**
 * Reducer
 * */

const ReducerState = {
    fields: {},
};

export default function reducer(state = ReducerState, action) {
    const { type, payload } = action;

    switch (type) {
        case SUBMIT_PROFILE_FORM_SUCCESS:
            return {
                ...state,
                ...payload,
            };

        case ON_CHANGE_PROFILE_FORM:
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
export const profileFieldsSelector = state => state[ moduleName ].fields;

/**
 * Action Creators
 * */

export const submitProfileForm = fields => ({
    type:    SUBMIT_PROFILE_FORM,
    payload: fields,
});

export const submitProfileFormSuccess = data => ({
    type:    SUBMIT_PROFILE_FORM_SUCCESS,
    payload: data,
});

export const onChangeProfileForm = fields => ({
    type:    ON_CHANGE_PROFILE_FORM,
    payload: fields,
});
